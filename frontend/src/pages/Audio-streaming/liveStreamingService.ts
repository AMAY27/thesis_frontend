// 
// src/services/liveStreamService.ts
import { io, Socket } from "socket.io-client";

export type LiveEvent = {
  ClassName: string;
  ClassName_German: string;
  filename?: string;
  timepoint?: string;
};


class LiveStreamService {
  private socket!: Socket;

  constructor() {
    this.socket = io("http://localhost:5001", {
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ WS connected:", this.socket.id);
    });
    this.socket.on(
      "live_events",
      (payload: { events?: LiveEvent[]; error?: string }) => {
        if (payload.error) {
          console.error("Detection error:", payload.error);
        } else {
          console.log("Detected events:", payload.events);
        }
      }
    );
    this.socket.on("disconnect", () => {
      console.log("❌ WS disconnected");
    });
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
