import { useState, useRef } from 'react';

// Extend the Window interface to include showSaveFilePicker
declare global {
  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<any>;
  }
}
import hoc from '../../hoc/hoc';
import './AudioStreaming.css';
import { FaPlay } from "react-icons/fa6";
import { BsRecordCircle } from "react-icons/bs";
import { ApiResponse, sendRecordingForAnalysis } from './api.service';


const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [fileName, setFileName] = useState('');
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
        console.log('Chunk received:', event.data.size, event.data.type);
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
    const audioBlob = new Blob(audioChunks);
    const options = {
      types: [
        {
          description: 'Audio file',
          accept: { 'audio/webm': ['.webm'] },
        },
      ],
    };
    // Show the save file picker to the user.
    if (!window.showSaveFilePicker) {
      throw new Error('The showSaveFilePicker API is not supported in this browser.');
    }
    const fileHandle = await window.showSaveFilePicker(options);
    
    // Create a writable stream and save the file
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(audioBlob);
    await writableStream.close();

    // Use the file name from the handle (full path is not available)
    let localFileName = fileHandle.name;
    let finalFileName = localFileName;

    // Prepare the FormData payload
    const formData = new FormData();
    formData.append('wavfile', audioBlob, finalFileName);

    const analyzeStreamAndGetAnalytics = await sendRecordingForAnalysis("/api/sound_analysis", formData);
    console.log(analyzeStreamAndGetAnalytics);
  };

  return (
    <div className='streaming-parent'>
        <div className='audio-recorder'>
            <h3>Audio Recorder</h3>
            <div className='record-buttons-div'>
                {!recording ? (
                  <button onClick={startRecording}>
                    <span style={{marginRight:"4px"}}><FaPlay/></span> 
                    Start Recording
                  </button>
                ) : (
                  <button style={{backgroundColor:"red", color:"white"}} onClick={stopRecording}>
                    <span style={{marginRight:"4px"}}><BsRecordCircle/></span> 
                    Stop Recording
                  </button>
                )}
            </div>
            {/* If recording has been stopped and audio chunks are available, provide options to send and playback */}
            {audioChunks.length > 0 && !recording && (
                <div>
                  <div className='filename-div'>
                    <label>
                      Filename:
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                      />
                    </label>
                  </div>
                  <audio
                    className='audio-player'
                    controls
                    src={URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm; codecs=opus" }))}
                  />
                </div>
            )}
            <button onClick={handleSend}>Send Recording</button>
        </div>
    </div>
  );
};

export default hoc(AudioRecorder);
