
import './index.css';
import './App.css'
import { NavContextProvider } from './global-context/NavContext';
import { AudioStreamContextProvider } from './pages/Audio-streaming/context/AudioStreamContext';
import AlertManagement from './pages/Alert-management/AlertManagement'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomEvents from './pages/Event-Tracking/CustomEvents';
import AlertCalendar from './pages/Alert-management/components/AlertCalendar';
import EventMonitor from './pages/Event-monitor/EventMonitor';
import AudioStreaming from './pages/Audio-streaming/AudioStreaming';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

function App() {

  return (
      <NavContextProvider>
        <AudioStreamContextProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            <Route path="/alerts" element={<AlertManagement />} />
            <Route path="/customevents" element={<CustomEvents/> } />
            <Route path='/eventsmonitor' element={<EventMonitor/>} />
            <Route path="/alert/calendar" element={<AlertCalendar />} />
            <Route path="/livestream" element={<AudioStreaming/>} />
          </Routes>
          <ToastContainer />
        </Router>
        </LocalizationProvider>
        </AudioStreamContextProvider>
      </NavContextProvider>
  )
}

export default App;
