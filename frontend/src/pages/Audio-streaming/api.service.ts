import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstanceFlask } from '../../axios/axios';
import notification from '../../axios/notification';
import { io, Socket } from "socket.io-client";

export interface ApiResponse {
    class_counts: Record<string, number>;
    records: RecordItem[];
}

export interface RecordItem {
    ClassName: string;
    ClassName_German: string;
    filename: string;
    timepoint: string;
}



export const sendRecordingForAnalysis = async <TResponse> (
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig 
): Promise<TResponse> => {
    try {
        const resp = await axiosInstanceFlask.post<TResponse>(url, formData, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching ${url}. ${message ?? ''}`, 'error');
        throw error;
    }
}



class LiveStreamService {
  private socket: Socket;
  constructor() {
    this.socket = io("http://127.0.0.1:5001", {
      transports: ["websocket"],
    });
    this.socket.on("connect", () => {
      console.log("Connected to live streaming backend via WebSocket");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from live streaming backend");
    });
  }

  // Sends an audio chunk to the backend
  sendAudioChunk(audioChunk: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64String = base64data.split(",")[1]; // Remove data prefix
      this.socket.emit("audio_chunk", { audio: base64String });
    };
    reader.readAsDataURL(audioChunk);
  }

  // Register a callback to listen for live events
  onLiveEvents(callback: (data: any) => void) {
    this.socket.on("live_events", callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const liveStreamService = new LiveStreamService();
