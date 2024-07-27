import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const CreatePage = () => {
  const handleMint = () => {
    console.log('Mint function called');
    // 这里将来会实现与智能合约的交互
  };

  const handleStake = () => {
    console.log('Stake function called');
    // 这里将来会实现与智能合约的交互
  };

  const handleCreateProduct = () => {
    console.log('Create Product function called');
    // 这里将来会实现与智能合约的交互
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
          Create & Manage
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <AddCircleOutlineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="div">
                  Mint
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create new tokens and add them to the blockchain. Minting is the process of generating new cryptocurrencies or tokens.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={handleMint}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Mint Tokens
                </StyledButton>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <AccountBalanceIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="div">
                  Stake
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lock up your tokens to support network operations and earn rewards. Staking helps secure the network and can provide passive income.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={handleStake}
                  startIcon={<AccountBalanceIcon />}
                >
                  Stake Tokens
                </StyledButton>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="div">
                  Create Product
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Design and launch new digital products or services on the blockchain. This could include NFTs, digital assets, or tokenized real-world items.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={handleCreateProduct}
                  startIcon={<ShoppingCartIcon />}
                >
                  Create Product
                </StyledButton>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreatePage;
