// indexedDBService.ts
import { LiveEvent } from "./types";
import { EventsMonitorData } from "../Event-monitor/types";
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

export async function getEventsMonitoringData(): Promise<EventsMonitorData>{
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIVE_EVENTS_STORE_NAME], "readonly");
    const store = transaction.objectStore(LIVE_EVENTS_STORE_NAME);
    const request = store.getAll();
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
    const today = new Date(Date.now()).toISOString();
    const todayDate = today.split("T")[0];
    const currentTime = today.split("T")[1]?.split(".")[0].slice(0,5);
    const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const dayBeforeYesterdayDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split("T")[0];
    const fiveMinutesAgoTime = new Date(Date.now() - 5 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const fifteenMinutesAgoTime = new Date(Date.now() - 15 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const thirtyMinutesAgoTime = new Date(Date.now() - 30 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const oneHourAgoTime = new Date(Date.now() - 60 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const threeHourAgoTime = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const sixHourAgoTime = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const twelveHourAgoTime = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    const twentyFourHourAgoTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[1]?.split(".")[0].slice(0,5);
    console.log({
      "todayDate": today,
      "Current Time": currentTime,
      "yesterday": yesterdayDate,
      "dayBeforeYesterday": dayBeforeYesterdayDate,
      "fiveMinutes": fiveMinutesAgoTime,
      "fifteenMinutes": fifteenMinutesAgoTime,
      "thirtyMinutes": thirtyMinutesAgoTime,
      "oneHour": oneHourAgoTime,
      "threeHour": threeHourAgoTime,
      "sixHour": sixHourAgoTime,
      "twelveHour": twelveHourAgoTime,
      "twentyFourHour": twentyFourHourAgoTime,
    })
    
    request.onsuccess = () => {
      console.log("Live events:", request.result);

      request.result.forEach((event: LiveEvent) => {
        const eventDate = parseDateTime(event.Datetime, event.Datetime_2);
        if(eventDate <= parseDateTime(todayDate, currentTime) && eventDate >= parseDateTime(todayDate, fiveMinutesAgoTime)){
          const existingEntry = result.fiveMinutes.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            // Increase count by 1 if exists
            existingEntry.count += 1;
          } else {
            // Add new entry with a count of 1 if not already present
            result.fiveMinutes.push({ _id: event.ClassName, count: 1 });
          }
        }
            // 15 Minutes window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, fifteenMinutesAgoTime)
        ) {
          const existingEntry = result.fifteenMinutes.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.fifteenMinutes.push({ _id: event.ClassName, count: 1 });
          }
        }
        // 30 Minutes window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, thirtyMinutesAgoTime)
        ) {
          const existingEntry = result.thirtyMinutes.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.thirtyMinutes.push({ _id: event.ClassName, count: 1 });
          }
        }
        // 1 Hour window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, oneHourAgoTime)
        ) {
          const existingEntry = result.oneHour.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.oneHour.push({ _id: event.ClassName, count: 1 });
          }
        }
        // 3 Hour window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, threeHourAgoTime)
        ) {
          const existingEntry = result.threeHour.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.threeHour.push({ _id: event.ClassName, count: 1 });
          }
        }
        // 6 Hour window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, sixHourAgoTime)
        ) {
          const existingEntry = result.sixHour.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.sixHour.push({ _id: event.ClassName, count: 1 });
          }
        }
        // 12 Hour window
        else if (
          eventDate < parseDateTime(todayDate, currentTime) &&
          eventDate >= parseDateTime(todayDate, twelveHourAgoTime)
        ) {
          const existingEntry = result.twelveHour.find(
            (entry) => entry._id === event.ClassName
          );
          if (existingEntry) {
            existingEntry.count += 1;
          } else {
            result.twelveHour.push({ _id: event.ClassName, count: 1 });
          }
        }
      })
      resolve(result);
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
