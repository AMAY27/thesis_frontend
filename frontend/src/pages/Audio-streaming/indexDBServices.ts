// indexedDBService.ts

export interface AudioFileRecord {
  fileName: string;
  audioBlob: Blob;
  metadata: any;
  timestamp: number;
}

const DB_NAME = "AudioRecorderDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "fileName" });
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
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const data: AudioFileRecord = { fileName, audioBlob, metadata, timestamp: Date.now() };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving audio file", event);
      reject(event);
    };
  });
}

export async function getAllAudioFiles(): Promise<AudioFileRecord[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as AudioFileRecord[]);
    request.onerror = (event) => {
      console.error("Error reading audio files", event);
      reject(event);
    };
  });
}

export async function getAudioFile(fileName: string): Promise<AudioFileRecord | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileName);
    request.onsuccess = () => resolve(request.result as AudioFileRecord | undefined);
    request.onerror = (event) => {
      console.error(`Error reading audio file for ${fileName}`, event);
      reject(event);
    };
  });
}
