import { useState, useRef } from 'react';
import { liveStreamService } from '../liveStreamingService';
import { FaPlay, FaStop, FaMicrophone } from 'react-icons/fa';
import LiveAudioCanvasVisualizer from './LiveAudioCanvasVisualizer';
import { useAudioStreamContext } from '../context/AudioStreamContext';
import './LiveAudioStreamer.css';

const LiveAudioStreamer = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [streaming, setStreaming] = useState(false);
  const { setLiveEvents } = useAudioStreamContext();

  const startStreaming = async () => {
    setStreaming(true);
    liveStreamService.startStreaming();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);

    await ctx.audioWorklet.addModule('/pcm-processor.js');
    const pcmNode = new AudioWorkletNode(ctx, 'pcm-processor');
    workletRef.current = pcmNode;

    pcmNode.port.onmessage = (e: MessageEvent<Float32Array>) => {
      liveStreamService.sendPCMChunk(e.data);
    };

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    source.connect(analyser);
    source.connect(pcmNode).connect(ctx.destination);

    console.log('Started streaming audio');
  };

  const stopStreaming = () => {
    setStreaming(false);

    audioCtxRef.current?.suspend();
    workletRef.current?.disconnect();
    audioCtxRef.current?.close();

    liveStreamService.disconnect();
    setLiveEvents([]);

    console.log('Stopped streaming');
  };

  return (
    <div className="streamer-card">
      <div className="streamer-header">
        <FaMicrophone className="mic-icon" />
        <span>Live Audio Stream</span>
      </div>

      <LiveAudioCanvasVisualizer analyser={analyserRef.current} />

      <div className="stream-controls">
        {!streaming ? (
          <button onClick={startStreaming} className="btn start-btn">
            <FaPlay /> Start Streaming
          </button>
        ) : (
          <button onClick={stopStreaming} className="btn stop-btn">
            <FaStop /> Stop Streaming
          </button>
        )}
      </div>

      <p className="stream-status">
        {streaming ? "Streaming..." : "Idle"}
      </p>
    </div>
  );
};

export default LiveAudioStreamer;
