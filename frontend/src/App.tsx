
// import './App.css'
import { NavContextProvider } from './global-context/NavContext';
import AlertManagement from './pages/Alert-management/AlertManagement'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom';

function App() {

  return (
      <NavContextProvider>
        <Router>
          <Routes>
            <Route path="/alerts" element={<AlertManagement />} />
          </Routes>
        </Router>
      </NavContextProvider>
  )
}

export default App
