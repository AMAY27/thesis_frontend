// 
// src/services/liveStreamService.ts
import { io, Socket } from "socket.io-client";
import { getTopTenLiveEvents, saveLiveEvent } from "./indexDBServices";
import { LiveEvent } from "./types";
import { useAudioStreamContext } from "./context/AudioStreamContext";

class LiveStreamService {
  private socket!: Socket;
  private setLiveEventsCallback?: (events: LiveEvent[]) => void;

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
              event.classname,
              event.classnameGerman,
              event.confidence,
              event.Datetime,
              event.Datetime_2
            );
          }
          // Update live events through the callback
          if (this.setLiveEventsCallback) {
            const events = await getTopTenLiveEvents();
            this.setLiveEventsCallback(events);
          }
        }
      }
    });
    this.socket.on("disconnect", () => {
      console.log("❌ WS disconnected");
    });
  }

  setLiveEventsHandler(callback: (events: LiveEvent[]) => void) {
    this.setLiveEventsCallback = callback;
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
