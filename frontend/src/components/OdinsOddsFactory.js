import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


function OdinsOddsFactory({ blockchain }) {



  useEffect(() => {
    (async () => {
      if (!blockchain.aggregator) {
        return;
      }

    })();
  },[blockchain]);
  
 
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
          <form noValidate autoComplete='off' /*onSubmit={}*/>
          <Grid item>
            <TextField 
              // onChange={(e) => setDepositAmount(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Game Contract Address" 
              variant="outlined"
              required
            />
            <TextField 
              // onChange={(e) => setDepositAmount(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Game ID" 
              variant="outlined"
              required
            />
            <TextField 
              // onChange={(e) => setDepositAmount(e.target.value)}
              sx={{ m: 1, width: '42ch' }}
              id="outlined-basic" 
              label="Expiry Time" 
              variant="outlined"
              required
            />
            <TextField 
              // onChange={(e) => setDepositAmount(e.target.value)}
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
              // onClick={}
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