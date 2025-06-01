
import { AddAlertProps } from "../Alert-management/types";
import { getAllLiveEvents } from "../Audio-streaming/indexDBServices";
import { CustomEventAnalyticsProps } from "./types";

const DB_NAME = "EventTrackerDB";
const DB_VERSION = 1;
const CUSTOM_EVENT_STORE_NAME = "customEvents";

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => {
            console.error("Error opening IndexedDB", event);
            reject(event);
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(CUSTOM_EVENT_STORE_NAME)) {
                const store = db.createObjectStore(CUSTOM_EVENT_STORE_NAME, { keyPath: "createdAt" });
                store.createIndex("createdAt", "createdAt", { unique: true });
            }
        };
    })
}

export async function saveCustomEvent(event: AddAlertProps ): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction([CUSTOM_EVENT_STORE_NAME], "readwrite");
        const store = transaction.objectStore(CUSTOM_EVENT_STORE_NAME);
        const request = store.put(event);
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error("Error saving custom event", event);
            reject(event);
        };
    });
}

export async function getCustomEventsForAnalytics(): Promise<CustomEventAnalyticsProps[]> {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction([CUSTOM_EVENT_STORE_NAME], "readonly");
        const store = transaction.objectStore(CUSTOM_EVENT_STORE_NAME);
        const request = store.getAll();
        request.onsuccess = async () => {
            const customEvents = request.result;
            const events = await getAllLiveEvents();
            let customEventsAnalytics:CustomEventAnalyticsProps[] = [];
            customEvents.forEach((event) => {
                const customEventDetails = {
                    id: event.createdAt,
                    title: event.title,
                    classname: event.classname,
                    start_date: event.start_date,
                    end_date: event.end_date,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    status: event.status,
                    createdAt: event.createdAt,
                }
                const filteredEvents = events.filter((e) => {
                    const eventDate = parseDateTime(e.Datetime, e.Datetime_2);
                    const startDate = parseDateTime(event.start_date, event.start_time);
                    const endDate = parseDateTime(event.end_date, event.end_time);
                    return event.classname === e.ClassName && eventDate >= startDate && eventDate <= endDate;
                });
                const monthMap = new Map<string, { freq: number; dailyFrequency: Map<string, number> }>();
                for (const event of filteredEvents) {
                    const month = event.Datetime.slice(0,7);
                    console.log(month);
                    const day = event.Datetime
                    if (!monthMap.has(month)) {
                        monthMap.set(month, { freq: 0, dailyFrequency: new Map<string, number>() });
                    }
                    const monthData = monthMap.get(month);
                    if (monthData) {
                        monthData.freq += 1;
                        const currentCount = monthData?.dailyFrequency.get(day) || 0;
                        monthData?.dailyFrequency.set(day, currentCount + 1);
                    }
                }
                const frequencies = Array.from(monthMap.entries()).map(([month, data]) => {
                    const dailyFrequency = Array.from(data.dailyFrequency.entries()).map(([date, count]) => ({ date, count }));
                    return { month, freq: data.freq, dailyFrequency };
                });
                const result: CustomEventAnalyticsProps = {
                    customEventDetails,
                    frequencies,
                };
                customEventsAnalytics.push(result);
            });
            console.log(customEventsAnalytics);
            resolve(customEventsAnalytics);
        }
        request.onerror = (event) => {
            console.error("Error fetching custom events", event);
            reject(event);
        };
    });
}

function parseDateTime(date: string, time: string): Date {
    const [Y, M, D] = date.split('-').map(Number);
    const [h, m]    = time.split(':').map(Number);
    return new Date(Y, M - 1, D, h, m);
}