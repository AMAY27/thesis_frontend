// import { saveCustomEventProps } from "./types";
import { BaseEventProps } from "../../components/Forms/GlobalForm";

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

export async function saveCustomEvent(event: BaseEventProps): Promise<void> {
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
