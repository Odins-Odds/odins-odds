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
  const [Stage, setStage] = useState(false);


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



        console.log(hasEnded);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWagerData();
  }, [blockchain, id]);

  const checkGameResult = async () => {
    try {
      if (!wagerContract) {
        throw new Error('Wager contract is not loaded');
      }
      // TODO use GAME ID!!! use the new contract function to do that you have to update the ABI first
      const ID = await wagerContract.checkGameResult(id); 
      console.log(ID);
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

            <form noValidate autoComplete='off' /*onSubmit={getPrediction}*/>
              <Grid item xs={12}>
                <TextField 
                  // onChange={(e) => setPredictionID(e.target.value)}
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

            <form noValidate autoComplete='off' /*onSubmit={getPrediction}*/>
              <Grid item xs={12}>
                <TextField 
                  // onChange={(e) => setPredictionID(e.target.value)}
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



            <Button 
              variant='contained'
              onClick={checkGameResult} >
              Check game result 
            </Button>
            {/* make function to take in game ID in the function should only be a button */}
            {/* <Button 
              variant='contained'
              onClick={gettPredictionID} >
              Check Game Result
            </Button>
            <Button 
              variant='contained'
              onClick={gettPredictionID} >
              Withdraw Winnings
            </Button> */}

            <Box sx={{ padding: 5 }}>
              <Typography >
                Has Prediction Ended: {hasEnded}
              </Typography>
              <Typography>
                Stage: {Stage}
              </Typography>
            </Box>

          </Grid>
        </Box>
      </div>
    );
};

export default OdinsPrediction;


