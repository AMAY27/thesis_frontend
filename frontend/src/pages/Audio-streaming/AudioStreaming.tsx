import { useState, useRef, useEffect } from 'react';
import LiveAudioStreamer from './components/LiveAudioStreamer';
import { useAudioStreamContext } from './context/AudioStreamContext';
import { getEventsMonitoringData } from './indexDBServices';
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
import { sendRecordingForAnalysis } from './api.service';
import { saveAudioFile, getAllAudioFiles } from './indexDBServices';
import { liveStreamService } from './liveStreamingService';
import { EventsMonitorData } from '../Event-monitor/types';
import EventMonitor from '../Event-monitor/EventMonitor';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [fileName, setFileName] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const { setLiveEvents,liveEvents } = useAudioStreamContext();


  useEffect(() => {
    liveStreamService.setLiveEventsHandler(setLiveEvents);
  }, [setLiveEvents]);

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
  const deleteRecording = () => {
    // Clear the audio chunks and reset the recording state
    setAudioChunks([]);
    setRecording(false);
    mediaRecorderRef.current = null;
    streamRef.current = null;
    setFileName('');
  }

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
    //if (!window.showSaveFilePicker) {
    //  throw new Error('The showSaveFilePicker API is not supported in this browser.');
    //}
    //const fileHandle = await window.showSaveFilePicker(options);
    //
    //// Create a writable stream and save the file
    //const writableStream = await fileHandle.createWritable();
    //await writableStream.write(audioBlob);
    //await writableStream.close();

    // Use the file name from the handle (full path is not available)
    //let localFileName = fileHandle.name;
    let finalFileName = fileName || 'recording.webm';

    // Prepare the FormData payload
    const formData = new FormData();
    formData.append('wavfile', audioBlob, finalFileName);

    const analysisResult = await sendRecordingForAnalysis("/api/sound_analysis", formData);
    console.log(analysisResult);
    try {
      await saveAudioFile(finalFileName, audioBlob, analysisResult);
      console.log("Audio file and metadata saved in IndexedDB for", finalFileName);
    } catch (err) {
      console.error("Error saving audio file in IndexedDB", err);
    }
  };
  const handleReadStoredFiles = async () => {
    try {
      const allFiles = await getAllAudioFiles();
      setAudioFiles(allFiles);
      console.log("All stored audio files:", allFiles);
    } catch (err) {
      console.error("Error reading stored audio files", err);
    }
  };

  useEffect(() => {
    handleReadStoredFiles();
  },[])

  return (
    <div className='streaming-parent'>
      <div className="live-streamer">
        {liveEvents.length > 0 && 
          <div className='live-events-list'>
            {liveEvents.map((event, index) => (
              <div key={index} className='live-event-item'>
                <p>{event.ClassName}</p>
                <p>{event.Datetime}</p>
              </div>
          ))}
          </div>}
        <LiveAudioStreamer />
        <EventMonitor/>
      </div>
      <div className='audio-recorder'>
        <h3>Record sample files for analysis</h3>
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
                <button onClick={deleteRecording}>delete</button>
              </div>
              <audio
                className='audio-player'
                controls
                src={URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm; codecs=opus" }))}
              />
              <button onClick={handleSend}>Send Recording</button>
            </div>
        )}
          <div>
            {audioFiles.length > 0 && (
              <div className='audio-files-list'>
                <h3>Stored Audio Files</h3>
                {audioFiles.map((file, index) => (
                  <div key={index} className='audio-file-item'>
                    <span>{file.fileName}</span>
                    <div>
                      <span>Metadata:</span>
                      <pre>{JSON.stringify(file.metadata, null, 2)}</pre>
                    </div>
                    <audio controls src={URL.createObjectURL(file.audioBlob)} />
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
        
    </div>
  );
};

export default hoc(AudioRecorder);
