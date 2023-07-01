import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wager from '../ABIs/Wager.json';
import { useParams } from 'react-router-dom';


const OdinsPrediction = ({ blockchain }) => {
  const { id } = useParams();
  const [wagerContract, setWagerContract] = useState({});


  useEffect(() => {
    const fetchWagerData = async () => {
      try {
        const wagerAddress = await blockchain.odinsOddsFactory.getWager(id);
        console.log(wagerAddress, 'addressss');
        const wagerContract = new ethers.Contract(
          wagerAddress,
          wager.abi,
          blockchain.account
        );
        // Fetch data from the wager contract
        setWagerContract(wagerContract);
        // console.log(wagerContract);

      } catch (error) {
        console.error(error);
      }
    };

    fetchWagerData();
  }, [blockchain, id]);

  const gettPredictionID = async () => {
    try {
      if (!wagerContract) {
        throw new Error('Wager contract is not loaded');
      }
      console.log(wagerContract,'da contract')
      const ID = await wagerContract.getContractID(); 
      console.log(ID)
    } 
    catch (error) {
      showError(error);
    }
  };


    return (
        <div>
            <h1>Prediction Page for {id}</h1>
            <Button onClick={gettPredictionID} >click</Button>
        </div>
    );
};

export default OdinsPrediction;


