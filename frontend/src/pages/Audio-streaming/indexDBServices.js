// indexedDBService.js

const DB_NAME = "AudioRecorderDB";
const DB_VERSION = 1;
const STORE_NAME = "audioFiles";

// Open (or create) the IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => {
      console.error("Error opening IndexedDB", event);
      reject(event);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onupgradeneeded = (event) => {
      const db = request.result;
      // Create an object store for audio files and metadata keyed by fileName
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "fileName" });
        // Optionally, create an index for timestamp if you want to query by date.
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

// Save an audio file with metadata
export async function saveAudioFile(fileName, audioBlob, metadata = {}) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const data = { fileName, audioBlob, metadata, timestamp: Date.now() };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving audio file", event);
      reject(event);
    };
  });
}

// Retrieve all stored audio file records (includes audioBlob and metadata)
export async function getAllAudioFiles() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error reading audio files", event);
      reject(event);
    };
  });
}

// Retrieve a specific audio file record by fileName
export async function getAudioFile(fileName) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error(`Error reading audio file for ${fileName}`, event);
      reject(event);
    };
  });
}
