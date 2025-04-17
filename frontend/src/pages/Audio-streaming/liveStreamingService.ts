// src/services/liveStreamService.ts
import { io, Socket } from "socket.io-client";

export interface LiveEvent { 
    ClassName: string;
    ClassName_German: string;
    filename: string;
    timepoint: string;
 }

class LiveStreamService {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:5001", {
        transports: ["polling", "websocket"],
        path: "/socket.io",
    });

    this.socket.on("connect", () =>
      console.log("🟢 WS connected", this.socket.id)
    );

    this.socket.on("connected", (msg) =>
      console.log("server ready:", msg)
    );

    this.socket.on("live_events", (data: { events?: LiveEvent[]; error?: string }) => {
      if (data.error) {
        console.error("Detection error:", data.error);
      } else {
        console.log("Detected events:", data.events);
      }
    });

    this.socket.on("disconnect", () =>
      console.log("🔴 WS disconnected")
    );
  }

  sendPCMChunk(chunk: Float32Array) {
    // send raw ArrayBuffer
    this.socket.emit("audio_chunk", chunk.buffer);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const liveStreamService = new LiveStreamService();
