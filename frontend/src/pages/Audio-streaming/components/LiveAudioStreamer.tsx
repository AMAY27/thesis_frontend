// LiveAudioStreamer.tsx
import { useState, useRef } from 'react';
import { liveStreamService } from '../liveStreamingService'; // Socket.IO client service
import { FaPlay, FaStop } from 'react-icons/fa';
import LiveAudioCanvasVisualizer from './LiveAudioCanvasVisualizer';
import './LiveAudioStreamer.css';


const LiveAudioStreamer = () => {
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [streaming, setStreaming] = useState(false);

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
      liveStreamService.sendPCMChunk(e.data);
    };

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    source.connect(analyser);

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
    <div className='live-audio-streamer'>
      <div>
        <LiveAudioCanvasVisualizer analyser={analyserRef.current} />
      </div>
      <div className="stream-buttons">
        {!streaming ? (
          <button onClick={startStreaming} className='start-button'>
            <FaPlay style={{ marginRight: "4px" }} /> Start Streaming
          </button>
        ) : (
          <button onClick={stopStreaming} className='stop-button'>
            <FaStop style={{ marginRight: "4px" }} /> Stop Streaming
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveAudioStreamer;
