import { AddAlertProps, AlertLogProps} from "./types";
import { LiveEvent } from "../Audio-streaming/types";


const DB_NAME = "AlertManagementDB";
const DB_VERSION = 4;
const ALERTS_STORE_NAME = "alert";
const ALERT_LOG_STORE_NAME = "alertLog";

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
      if (!db.objectStoreNames.contains(ALERT_LOG_STORE_NAME)) {
        const store = db.createObjectStore(ALERT_LOG_STORE_NAME, { keyPath: "createdAt" });
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

export async function getAlerts(): Promise<AddAlertProps[]> {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([ALERTS_STORE_NAME], "readonly");
    const store = transaction.objectStore(ALERTS_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => {
      console.error("Error fetching alerts", event);
      reject(event);
    };
  });
}

export async function saveAlertLog(alertLog: AlertLogProps): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const db = await openDatabase();
    const transaction = db.transaction([ALERT_LOG_STORE_NAME], "readwrite");
    const store = transaction.objectStore(ALERT_LOG_STORE_NAME);
    const request = store.put(alertLog);
    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      console.error("Error saving alert log", event);
      reject(event);
    };
  });
}

export async function checkForAlertsFromLiveEvents(events: LiveEvent[]) {
    const alerts = await getAlerts();   // assume returns Alert[]

    alerts.forEach((alert) => {
      events.forEach((ev) => {
        if (ev.ClassName === alert.classname) {
          // build Date objects for the alert window
          const windowStart = parseDateTime(alert.start_date, alert.start_time);
          const windowEnd   = parseDateTime(alert.end_date, alert.end_time);
  
          // parse the event’s own date+time into a Date()
          const evDate = parseDateTime(ev.Datetime, ev.Datetime_2);
          console.log(`Event Date: ${evDate}, Window Start: ${windowStart}, Window End: ${windowEnd}`);
          // check if the event lies in the alert window
          if (evDate >= windowStart && evDate <= windowEnd) {
            // trigger the alert log saving function here
            window.alert(`Alert triggered for event: ${ev.ClassName} at ${ev.Datetime}`);
            saveAlertLog({
              alertId: alert.createdAt,
              alertTitle: alert.title,
              alertClass: alert.classname,
              triggerDate: ev.Datetime,
              time: ev.Datetime_2,
              createdAt: Date.now(),
            });
            console.log(`Alert triggered for event: ${ev.ClassName} at ${ev.Datetime}`);
          }
        }
      })
    })
  
    // return alerts.filter(alert => {
    //   // build Date objects for the alert window
    //   const windowStart = parseDateTime(alert.start_date, alert.start_time);
    //   const windowEnd   = parseDateTime(alert.end_date, alert.end_time);
  
    //   // keep this alert if any event matches its classname & lies in the window
    //   return events.some(ev => {
    //     if (ev.ClassName !== alert.classname) return false;
    //     if (!ev.Datetime || !ev.Datetime_2) return false;
  
    //     // parse the event’s own date+time into a Date()
    //     const evDate = parseDateTime(ev.Datetime, ev.Datetime_2);
    //     return evDate >= windowStart && evDate <= windowEnd;
    //   });
    // });
}
  
  // helper: combine a "YYYY‑MM‑DD" and "HH:mm" into a Date
function parseDateTime(date: string, time: string): Date {
  const [Y, M, D] = date.split('-').map(Number);
  const [h, m]    = time.split(':').map(Number);
  return new Date(Y, M - 1, D, h, m);
}
