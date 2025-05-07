// indexedDBService.ts
import { LiveEvent } from "./types";
import { EventsMonitorData, SoundCount } from "../Event-monitor/types";
export interface AudioFileRecord {
  fileName: string;
  audioBlob: Blob;
  metadata: any;
  timestamp: number;
}

const DB_NAME = "AudioRecorderDB";
const DB_VERSION = 3;
const AUDIOFILES_STORE_NAME = "audioFiles";
const LIVE_EVENTS_STORE_NAME = "liveEvents";

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
      if (!db.objectStoreNames.contains(AUDIOFILES_STORE_NAME)) {
        const store = db.createObjectStore(AUDIOFILES_STORE_NAME, { keyPath: "fileName" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
      if (!db.objectStoreNames.contains(LIVE_EVENTS_STORE_NAME)) {
        const store = db.createObjectStore(LIVE_EVENTS_STORE_NAME, { keyPath: "timestamp" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

export async function saveAudioFile(
  fileName: string,
  audioBlob: Blob,
  metadata: any = {}
): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([AUDIOFILES_STORE_NAME], "readwrite");
    const store = transaction.objectStore(AUDIOFILES_STORE_NAME);
    const data: AudioFileRecord = { fileName, audioBlob, metadata, timestamp: Date.now() };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving audio file", event);
      reject(event);
    };
  });
}

export async function saveLiveEvent(
  ClassName: string,
  ClassName_German: string,
  confidence: number,
  Datetime: string,
  Datetime_2: string,
): Promise<void>{
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIVE_EVENTS_STORE_NAME], "readwrite");
    const store = transaction.objectStore(LIVE_EVENTS_STORE_NAME);
    const data = { ClassName, ClassName_German, confidence, Datetime, Datetime_2, timestamp: Date.now() };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving live event", event);
      reject(event);
    }
  });
}

export async function getAllAudioFiles(): Promise<AudioFileRecord[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([AUDIOFILES_STORE_NAME], "readonly");
    const store = transaction.objectStore(AUDIOFILES_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as AudioFileRecord[]);
    request.onerror = (event) => {
      console.error("Error reading audio files", event);
      reject(event);
    };
  });
}

export async function getTopTenLiveEvents(): Promise<LiveEvent[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIVE_EVENTS_STORE_NAME], "readonly");
    const store = transaction.objectStore(LIVE_EVENTS_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const events = request.result as LiveEvent[];
      const sortedEvents = events.reverse().slice(0, 10);
      resolve(sortedEvents);
    };
    request.onerror = (event) => {
      console.error("Error reading live events", event);
      reject(event);
    };
  });
}

export async function getAllLiveEvents(): Promise<LiveEvent[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIVE_EVENTS_STORE_NAME], "readonly");
    const store = transaction.objectStore(LIVE_EVENTS_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as LiveEvent[]);
    request.onerror = (event) => {
      console.error("Error reading live events", event);
      reject(event);
    };
  });
}

export async function getEventsMonitoringData(): Promise<EventsMonitorData[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIVE_EVENTS_STORE_NAME], "readonly");
    const store = transaction.objectStore(LIVE_EVENTS_STORE_NAME);
    const request = store.getAll();

    const monitorResult:EventsMonitorData[] = [];

    const result: EventsMonitorData = {
      fiveMinutes: [],
      fifteenMinutes: [],
      thirtyMinutes: [],
      oneHour: [],
      threeHour: [],
      sixHour: [],
      twelveHour: [],
      twentyFourHour: [],
      yesterday: [],
      dayBeforeYesterday: [],
    };

    const now = new Date();
    const thresholds = {
      fiveMinutes: new Date(now.getTime() - 5 * 60 * 1000),
      fifteenMinutes: new Date(now.getTime() - 15 * 60 * 1000),
      thirtyMinutes: new Date(now.getTime() - 30 * 60 * 1000),
      oneHour: new Date(now.getTime() - 60 * 60 * 1000),
      threeHour: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      sixHour: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      twelveHour: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      twentyFourHour: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      yesterday: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      dayBeforeYesterday: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    console.log("Thresholds:", thresholds);

    function addEventToBucket(bucket: SoundCount[], className: string) {
      const found = bucket.find(entry => entry._id === className);
      found ? found.count++ : bucket.push({ _id: className, count: 1 });
    }

    request.onsuccess = () => {
      console.log("Live events:", request.result);

      request.result.forEach((event: LiveEvent) => {
        const eventDate = parseDateTime(event.Datetime, event.Datetime_2);
        const eventDateOnly = event.Datetime.split("T")[0];

        if (eventDate > thresholds.fiveMinutes) addEventToBucket(result.fiveMinutes, event.ClassName);
        if (eventDate > thresholds.fifteenMinutes) addEventToBucket(result.fifteenMinutes, event.ClassName);
        if (eventDate > thresholds.thirtyMinutes) addEventToBucket(result.thirtyMinutes, event.ClassName);
        if (eventDate > thresholds.oneHour) addEventToBucket(result.oneHour, event.ClassName);
        if (eventDate > thresholds.threeHour) addEventToBucket(result.threeHour, event.ClassName);
        if (eventDate > thresholds.sixHour) addEventToBucket(result.sixHour, event.ClassName);
        if (eventDate > thresholds.twelveHour) addEventToBucket(result.twelveHour, event.ClassName);
        if (eventDate > thresholds.twentyFourHour) addEventToBucket(result.twentyFourHour, event.ClassName);

        if (eventDateOnly === thresholds.yesterday) addEventToBucket(result.yesterday, event.ClassName);
        if (eventDateOnly === thresholds.dayBeforeYesterday) addEventToBucket(result.dayBeforeYesterday, event.ClassName);
      });
      monitorResult.push(result);

      resolve(monitorResult);
    };

    request.onerror = (event) => {
      console.error("Error reading live events", event);
      reject(event);
    };
  });
}


export async function getAudioFile(fileName: string): Promise<AudioFileRecord | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([AUDIOFILES_STORE_NAME], "readonly");
    const store = transaction.objectStore(AUDIOFILES_STORE_NAME);
    const request = store.get(fileName);
    request.onsuccess = () => resolve(request.result as AudioFileRecord | undefined);
    request.onerror = (event) => {
      console.error(`Error reading audio file for ${fileName}`, event);
      reject(event);
    };
  });
}

function parseDateTime(date: string, time: string): Date {
  const [Y, M, D] = date.split('-').map(Number);
  const [h, m]    = time.split(':').map(Number);
  return new Date(Y, M - 1, D, h, m);
}
