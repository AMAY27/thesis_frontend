import { useEffect, useRef } from 'react';

interface Props {
  analyser: AnalyserNode | null;
  width?: number;
  height?: number;
  barColor?: string;
}

const LiveAudioCanvasVisualizer = ({
  analyser,
  width = 500,
  height = 75,
  barColor = '#f76565',
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      if (!canvasCtx || !canvas) return;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = barColor;
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, barColor]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
};

export default LiveAudioCanvasVisualizer;
