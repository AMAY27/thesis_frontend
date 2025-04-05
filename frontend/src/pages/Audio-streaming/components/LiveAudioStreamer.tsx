// LiveAudioStreamer.tsx
import { useState, useRef, useEffect } from 'react';
import { liveStreamService } from '../api.service'; // Socket.IO client service
import { FaPlay, FaStop } from 'react-icons/fa';
import './LiveAudioStreamer.css';

const LiveAudioStreamer = () => {
  const [streaming, setStreaming] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Setup live event listener
  useEffect(() => {
    liveStreamService.onLiveEvents((data) => {
      console.log("Live events received:", data);
      // Process the events: update UI or save to IndexedDB
    });
    return () => {
      liveStreamService.disconnect();
    };
  }, []);

  // Start live streaming by connecting to the microphone and starting MediaRecorder.
  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      // Start recording with a timeslice (e.g. every 3000ms a chunk is produced)
      mediaRecorder.start(3000);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log("Streaming chunk:", event.data.size);
          liveStreamService.sendAudioChunk(event.data);
        }
      };
      setStreaming(true);
    } catch (err) {
      console.error("Error starting live streaming:", err);
    }
  };

  // Stop live streaming
  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  return (
    <div className="live-streamer">
      <h3>Live Audio Streaming</h3>
      <div className="stream-buttons">
        {!streaming ? (
          <button onClick={startStreaming}>
            <FaPlay style={{ marginRight: "4px" }} /> Start Streaming
          </button>
        ) : (
          <button onClick={stopStreaming}>
            <FaStop style={{ marginRight: "4px" }} /> Stop Streaming
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveAudioStreamer;
