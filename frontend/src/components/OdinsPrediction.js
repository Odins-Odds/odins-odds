import { showError } from '../utils/common'
import { Button, Box, Typography, TextField, Grid } from "@mui/material";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import wager from '../ABIs/Wager.json';
import { useParams } from 'react-router-dom';


const OdinsPrediction = () => {
  const { id } = useParams();

    return (
        <div>
            <h1>Prediction Page for {id}</h1>
        </div>
    );
};

export default OdinsPrediction;