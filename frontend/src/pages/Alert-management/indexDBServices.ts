import { AddAlertProps } from "./types";


const DB_NAME = "AlertManagementDB";
const DB_VERSION = 3;
const ALERTS_STORE_NAME = "alert";

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
      if (!db.objectStoreNames.contains(ALERTS_STORE_NAME)) {
        const store = db.createObjectStore(ALERTS_STORE_NAME, { keyPath: "createdAt" });
        store.createIndex("createdAt", "createdAt", { unique: true });
      }
    };
  });
}

export async function saveAlert(alert: AddAlertProps): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([ALERTS_STORE_NAME], "readwrite");
    const store = transaction.objectStore(ALERTS_STORE_NAME);
    const request = store.put(alert);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving alert", event);
      reject(event);
    };
  });
}