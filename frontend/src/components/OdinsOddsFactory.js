import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


function OdinsOddsFactory({ blockchain }) {

  const [predictionID, setPredictionID] = useState();
  const [gameContractAddress, setGameContractAddress] = useState();
  const [gameID, setGameID] = useState();
  const [expiryTime, setExpiryTime] = useState();
  const [predictionChoices, setPredictionChoices] = useState();


  useEffect(() => {
    (async () => {
      if (!blockchain.odinsOddsFactory) {
        return;
      }

    })();
  },[blockchain]);
  
  const getPrediction = async (e) => {
    e.preventDefault();
    try {
      const pradiction = await blockchain.odinsOddsFactory.getWager(predictionID); 
      console.log(pradiction);
    } 
    catch (error) {
      showError(error);
    }
  };

  const createNewPrediction = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        const newPradiction = await blockchain.odinsOddsFactory.createWager(gameContractAddress, gameID, expiryTime, predictionChoices); 
        console.log(newPradiction);
      } 
      catch (error) {
        showError(error);
      }
    }
  };
 
  return (
    <div >
      <Box sx={{p:10}}>
        <Grid 
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >

        <form noValidate autoComplete='off' onSubmit={getPrediction}>
            <Grid item xs={12}>
            <TextField 
              onChange={(e) => setPredictionID(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Prediction ID" 
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
              Find Prediction
            </Button>
          </Grid>
          </form>

          <Box m={3}>
          </Box>

          <form noValidate autoComplete='off' onSubmit={createNewPrediction}>
          <Grid item xs={12}>
            <TextField 
              onChange={(e) => setGameContractAddress(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Game Contract Address" 
              variant="outlined"
              required
            />
            </Grid>
            <Grid item xs={12}>
            <TextField 
              onChange={(e) => setGameID(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Game ID" 
              variant="outlined"
              required
            />
            </Grid>
            <Grid item xs={12}>
            <TextField 
              onChange={(e) => setExpiryTime(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Expiry Time" 
              variant="outlined"
              required
            />
            </Grid>
            <Grid item xs={12}>

            <TextField 
              onChange={(e) => setPredictionChoices(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Prediction Choices" 
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
              Create Prediction
            </Button>
          </Grid>
          </form>

        </Grid>
      </Box>
    </div>
  );
}

export default OdinsOddsFactory;
