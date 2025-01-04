
// import './App.css'
import AlertManagement from './pages/Alert-management/AlertManagement'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom';

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/alerts" element={<AlertManagement />} />
        </Routes>
      </Router>
  )
}

export default App
