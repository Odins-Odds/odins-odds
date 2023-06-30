import { AppBar, Toolbar, Button, Typography, Box, Link, TextField } from '@mui/material'
import { ethers } from "ethers";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const NavBar = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [predictionId, setPredictionId] = useState("");

  const navigate = useNavigate();


  const accountsChanged = async (newAccount) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setAccount(newAccount.toString());
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
    window.ethereum.on("accountsChanged", accountsChanged)
  };

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountsChanged(res[0]);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Use the navigate function to navigate to the page for the entered prediction ID
    navigate(`/prediction/${predictionId}`);
  };
  
  return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6"
            component={RouterLink}
            to="/"
            noWrap
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block'}, cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
          Odins Odds
        </Typography>
        <Box sx={{ 
              flexGrow: 1, 
              display: 'flex',
              alignItems: 'center', // Align items vertically in the center
          }}>
              {/* <Link 
                  component={RouterLink} 
                  to="/" 
                  underline="none" 
                  sx={{ color: 'white', mr: 2 }}
              >
                  Home
              </Link> */}
              <form 
                  onSubmit={handleSubmit} 
                  sx={{ 
                      display: 'flex',
                      alignItems: 'center', // Align items vertically in the center
                      color: 'white'
                  }}
              >
                  <TextField
                      value={predictionId}
                      onChange={e => setPredictionId(e.target.value)}
                      placeholder="Enter prediction ID"
                      variant="standard" // Use the standard variant to have smaller input field
                      sx={{
                          mr: 2, // Add margin to the right
                          '& .MuiInputBase-root': { // Target the input field itself
                              color: 'white', // Make the input text white
                              backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white background
                              borderRadius: 1, // Small rounded corners
                          },
                          '& .MuiInput-underline:before': { // Hide the underline
                              display: 'none',
                          },
                          '& .MuiInput-underline:after': { // Hide the underline
                              display: 'none',
                          },
                      }}
                  />
                  <Button 
                      type="submit" 
                      variant="contained"
                      sx={{ 
                          color: 'black', // Black text
                          backgroundColor: 'white', // White background
                      }}
                  >
                      Go to Prediction
                  </Button>
              </form>
          </Box>
        <Typography       
          sx={{ pl:2}}
          variant="h6" 
          component="div">
          {balance ? 
            <Typography>Balance: {Number(balance).toFixed(4)} </Typography> 
            : <p href=" ">{''}</p>
          }
        </Typography>
        <Typography 
          sx={{ pl:2}}
          variant="h6" 
          component="div">
          {/* Ternary operator if else in line. if account show account if no account leave empty string */}
          {account ? 
            <Typography 
              underline="none"
              sx={{ pl:2, pr:5 }}
            >
              <Link 
                underline="none"
                color="white"
              >
                Account: {account.slice(0,5) + '...' + account.slice(38,42)} 
              </Link>
            </Typography> 
            : <Button
                variant='contained'
                onClick={connectHandler}>
                Connect Account
              </Button>
          }
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>
  );
};

export default NavBar;