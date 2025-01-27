
import './index.css';
import './App.css'
import { NavContextProvider } from './global-context/NavContext';
import AlertManagement from './pages/Alert-management/AlertManagement'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomEvents from './pages/Event-Tracking/CustomEvents';
import AlertCalendar from './pages/Alert-management/components/AlertCalendar';

function App() {

  return (
      <NavContextProvider>
        <Router>
          <Routes>
            <Route path="/alerts" element={<AlertManagement />} />
            <Route path="/customevents" element={<CustomEvents/> } />
            <Route path="/alert/calendar" element={<AlertCalendar />} />
          </Routes>
          <ToastContainer />
        </Router>
      </NavContextProvider>
  )
}

export default App;
