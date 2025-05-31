// 
// src/services/liveStreamService.ts
import { io, Socket } from "socket.io-client";
import { getEventsMonitoringData, getAllLiveEvents, saveLiveEvent } from "./indexDBServices";
import { LiveEvent } from "./types";
import { checkForAlertsFromLiveEvents } from "../Alert-management/indexDBServices";
import { EventsMonitorData } from "../Event-monitor/types";
import notification from "../../axios/notification";

class LiveStreamService {
  private socket!: Socket;
  private setLiveEventsCallback?: (events: LiveEvent[]) => void;
  private setLiveEventLogsCallback?: (eventLogs: LiveEvent[]) => void;
  private setLiveEventMonitoringDataCallback?: (eventMonitoringData: EventsMonitorData[]) => void;

  constructor() {
    this.socket = io("http://localhost:5001", {
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ WS connected:", this.socket.id);
    });
    this.socket.on("live_events", async (payload: { events?: LiveEvent[]; error?: string }) => {
      if (payload.error) {
        console.error("Detection error:", payload.error);
      } else {
        console.log("Detected events:", payload.events);
        if (payload.events) {
          // Save each live event to IndexedDB
          for (const event of payload.events) {
            await saveLiveEvent(
              event.ClassName,
              event.ClassName_German,
              event.confidence,
              event.Datetime,
              event.Datetime_2
            );
          }
          checkForAlertsFromLiveEvents(payload.events);
          // Update live events through the callback
          if (this.setLiveEventsCallback) {
            // const events = await getTopTenLiveEvents();
            this.setLiveEventsCallback(payload.events);
          }
          if (this.setLiveEventMonitoringDataCallback) {
            const eventMonitoringData: EventsMonitorData[] = await getEventsMonitoringData();
            this.setLiveEventMonitoringDataCallback(eventMonitoringData);
          }
          if (this.setLiveEventLogsCallback) {
            const eventLogs: LiveEvent[] = await getAllLiveEvents();
            this.setLiveEventLogsCallback(eventLogs);
          }
        }
      }
    });

    this.socket.on("connect_error", (err) => {    
      console.log(err.message);
      notification("Connection error: " + err.message, "error");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WS disconnected");
    });
  }

  setLiveEventsHandler(callback: (events: LiveEvent[]) => void) {
    this.setLiveEventsCallback = callback;
  }

  setLiveEventsMonitoringDataUpdateHandler(callback: (eventMonitoringData: EventsMonitorData[])=>void){
    this.setLiveEventMonitoringDataCallback = callback;
  }

  setLiveEventLogsHandler(callback: (eventLogs: LiveEvent[]) => void) {
    this.setLiveEventLogsCallback = callback;
  }

  startStreaming() {
    // If the socket is disconnected, try to (re)connect.
    if (!this.socket.connected) {
      console.log("Socket not connected - attempting to reconnect...");
      this.socket.connect();
    } else {
      console.log("Socket already connected.");
    }
  }

  sendPCMChunk(chunk: Float32Array) {
    // we send the raw ArrayBuffer payload
    this.socket.emit("audio_chunk", chunk.buffer);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const liveStreamService = new LiveStreamService();
