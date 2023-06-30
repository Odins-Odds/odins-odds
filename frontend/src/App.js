import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlockchain } from './utils/common'
import NavBar from "./components/navbar.js";
import OdinsOddsFactory from './components/OdinsOddsFactory.js';
import OdinsPrediction from './components/OdinsPrediction.js';

function App() {

  const [blockchain, setBlockchain] = useState({});

  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain());
    })();
  },[]);

  return (
    <Router>
    <div >
      <NavBar />
      <Routes>
        <Route path="/" element={ <OdinsOddsFactory blockchain={blockchain} /> } />
        <Route path="/prediction/:id" element={ <OdinsPrediction /> } />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
