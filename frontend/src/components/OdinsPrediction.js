import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wager from '../ABIs/Wager.json';
import { useParams } from 'react-router-dom';


const OdinsPrediction = ({ blockchain }) => {
  const { id } = useParams();
  const [wagerContract, setWagerContract] = useState({});
  const [hasEnded, setHasEnded] = useState(false);
  const [stage, setStage] = useState(false);
  const [prediction, setPrediction] = useState(false);


  useEffect(() => {
    const fetchWagerData = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wagerAddress = await blockchain.odinsOddsFactory.getWager(id);

        const wagerContract = new ethers.Contract(
          wagerAddress,
          wager.abi,
          signer
        );
        setWagerContract(wagerContract);

        const result = await wagerContract.hasWagerEnded();
        setHasEnded(result.toString());
        const stage = await wagerContract.getWagerStage();
        setStage(stage);

      } catch (error) {
        console.error(error);
      }
    };

    fetchWagerData();
  }, [blockchain, id]);

  const makePrediction = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        await wagerContract.placeBet(prediction); 
      } 
      catch (error) {
        showError(error);
      }
    }
  };

  const checkGameResult = async () => {
    try {
      if (!wagerContract) {
        throw new Error('Wager contract is not loaded');
      }
      let ID = await wagerContract.getGameID();
      let result = await wagerContract.checkGameResult(ID); 
      console.log(result);
    } 
    catch (error) {
      showError(error);
    }
  };

  const withdraw = async () => {
    try {
      if (!wagerContract) {
        throw new Error('Wager contract is not loaded');
      }
      let tx = await wagerContract.withdrawWinnings();
      console.log(tx);
    } 
    catch (error) {
      showError(error);
    }
  };


    return (
      <div>
        <Box sx={{p:10}}>
          <Grid 
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <h1>Prediction Page for {id}</h1>

            <form noValidate autoComplete='off' onSubmit={makePrediction}>
              <Grid item xs={12}>
                <TextField 
                  onChange={(e) => setPrediction(e.target.value)}
                  sx={{ m: 1, width: '42ch' }}
                  id="outlined-basic" 
                  label="Prediction" 
                  variant="outlined"
                  required
                />
                </Grid>
              <Grid 
                container
                justifyContent="center"
              >
                <Button 
                  type='submit'
                  variant='contained'>
                  Make Prediction
                </Button>
              </Grid>
            </form>

            <Grid item xs={12}>
              <Button 
                variant='contained'
                onClick={checkGameResult} >
                Check game result 
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button 
                variant='contained'
                onClick={withdraw} >
                Withdraw Winnings
              </Button>
            </Grid>

            <Box sx={{ padding: 5 }}>
              <Typography >
                Has Prediction Ended: {hasEnded}
              </Typography>
              <Typography>
                Stage: {stage}
              </Typography>
            </Box>

          </Grid>
        </Box>
      </div>
    );
};

export default OdinsPrediction;


