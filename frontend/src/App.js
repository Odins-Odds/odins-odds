import './App.css';
import { useEffect, useState } from 'react';
import { getBlockchain } from './utils/common'
import NavBar from "./components/navbar.js";
import OdinsOddsFactory from './components/OdinsOddsFactory.js';

function App() {

  const [blockchain, setBlockchain] = useState({});

  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain());
    })();
  },[]);

  return (
    <div >
    <NavBar />
    <OdinsOddsFactory blockchain={blockchain} />
    </div>
  );
}

export default App;
