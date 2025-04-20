// indexedDBService.ts
import { LiveEvent } from "./types";
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
