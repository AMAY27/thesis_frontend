import { useState, useRef } from 'react';
import hoc from '../../hoc/hoc';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // Request audio input from the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create a MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setAudioChunks([]);

      // Event listener to collect audio data chunks as they become available
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data && event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      });

      // Start recording
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      // Stop the recording and the audio stream
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleSend = async () => {
    // Combine the audio chunks into a single Blob with WAV MIME type
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

    // Prepare the FormData payload
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      // Send the audio file to the backend
      const response = await fetch('http://your-backend-endpoint/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Audio uploaded successfully.');
      } else {
        console.error('Audio upload failed.');
      }
    } catch (err) {
      console.error('Error sending audio to backend:', err);
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {/* If recording has been stopped and audio chunks are available, provide options to send and playback */}
      {audioChunks.length > 0 && !recording && (
        <div>
          <button onClick={handleSend}>Send Recording</button>
          <audio
            controls
            src={URL.createObjectURL(new Blob(audioChunks, { type: 'audio/wav' }))}
          />
        </div>
      )}
    </div>
  );
};

export default hoc(AudioRecorder);
