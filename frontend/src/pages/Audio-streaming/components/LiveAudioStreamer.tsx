// LiveAudioStreamer.tsx
import { useState, useRef } from 'react';
import { liveStreamService } from '../liveStreamingService'; // Socket.IO client service
import { FaPlay, FaStop } from 'react-icons/fa';
import { AudioVisualizer } from 'react-audio-visualize';


const LiveAudioStreamer = () => {
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [blob, setBlob] = useState<Blob>();
  const visualizerRef = useRef<HTMLCanvasElement>(null)

  const startStreaming = async () => {
    // 1) Get mic
    setStreaming(true);
    liveStreamService.startStreaming();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // 2) Hook up mic to worklet
    const source = ctx.createMediaStreamSource(stream);
    await ctx.audioWorklet.addModule("/pcm-processor.js");
    const pcmNode = new AudioWorkletNode(ctx, "pcm-processor");
    workletRef.current = pcmNode;

    // 3) When the worklet posts a chunk, send it
    pcmNode.port.onmessage = (e: MessageEvent<Float32Array>) => {
      setBlob(new Blob([e.data], { type: "audio/wav" }));
      liveStreamService.sendPCMChunk(e.data);
    };

    // 4) Connect graph and start
    source.connect(pcmNode).connect(ctx.destination);

    console.log("🎙️ Started streaming via AudioWorklet");
  };

  const stopStreaming = () => {
    // Tear down
    setStreaming(false);
    audioCtxRef.current?.suspend();
    workletRef.current?.disconnect();
    audioCtxRef.current?.close();
    liveStreamService.disconnect();
    console.log("🛑 Stopped streaming");
  };

  return (
    <div>
      <div>
        {blob && (
          <AudioVisualizer
            ref={visualizerRef}
            blob={blob}
            width={500}
            height={75}
            barWidth={1}
            gap={0}
            barColor={'#f76565'}
          />
        )}
      </div>
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

  //const [streaming, setStreaming] = useState(false);
  //const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  //const streamRef = useRef<MediaStream | null>(null);
//
  //// Setup live event listener
  //useEffect(() => {
  //  liveStreamService.onLiveEvents((data) => {
  //    console.log("Live events received:", data);
  //    // Process the events: update UI or save to IndexedDB
  //  });
  //  return () => {
  //    liveStreamService.disconnect();
  //  };
  //}, []);
//
  //// Start live streaming by connecting to the microphone and starting MediaRecorder.
  //const startStreaming = async () => {
  //  try {
  //    liveStreamService.startStreaming();
  //    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //    streamRef.current = stream;
  //    //const mediaRecorder = new MediaRecorder(stream);
  //    //mediaRecorderRef.current = mediaRecorder;
  //    //// Start recording with a timeslice (e.g. every 3000ms a chunk is produced)
  //    //mediaRecorder.start(8000);
  //    //mediaRecorder.ondataavailable = (event) => {
  //    //  if (event.data && event.data.size > 0) {
  //    //    console.log("Streaming chunk:", event.data.size);
  //    //    liveStreamService.sendAudioChunk(event.data);
  //    //  }
  //    //};
  //    let mimeType = 'audio/webm';  // fallback
  //    if (MediaRecorder.isTypeSupported('audio/wav')) {
  //      mimeType = 'audio/wav';
  //    }
//
  //    const mediaRecorder = new MediaRecorder(stream, { mimeType });
  //    mediaRecorderRef.current = mediaRecorder;
//
  //    mediaRecorder.ondataavailable = (event) => {
  //      if (event.data.size > 0) {
  //        console.log('Streaming chunk:', event.data.size, 'bytes as', mimeType);
  //        // 2) tell the service what extension we're sending
  //        liveStreamService.sendAudioChunk(event.data, mimeType.startsWith('audio/wav') ? '.wav' : '.webm');
  //      }
  //    };
  //    mediaRecorder.start(4000);
  //    setStreaming(true);
  //  } catch (err) {
  //    console.error("Error starting live streaming:", err);
  //  }
  //};
//
  //// Stop live streaming
  //const stopStreaming = () => {
  //  if (mediaRecorderRef.current) {
  //    mediaRecorderRef.current.stop();
  //    streamRef.current?.getTracks().forEach(track => track.stop());
  //    setStreaming(false);
  //  }
  //};
//
  //return (
  //  <div className="live-streamer">
  //    <h3>Live Audio Streaming</h3>
  //    <div className="stream-buttons">
  //      {!streaming ? (
  //        <button onClick={startStreaming}>
  //          <FaPlay style={{ marginRight: "4px" }} /> Start Streaming
  //        </button>
  //      ) : (
  //        <button onClick={stopStreaming}>
  //          <FaStop style={{ marginRight: "4px" }} /> Stop Streaming
  //        </button>
  //      )}
  //    </div>
  //  </div>
  //);
};

export default LiveAudioStreamer;
