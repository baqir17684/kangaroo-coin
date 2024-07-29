import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import contractABI from './YourContractABI.json';
import MintModal from './MintModal';
import StakeModal from './StakeModal';

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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 15,
    padding: theme.spacing(2),
    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
    color: 'white',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const CreatePage = () => {
  const [isMintModalOpen, setIsMintModalOpen] = React.useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = React.useState(false);

  const [account, setAccount] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        console.error('Please install MetaMask!');
      }
    };
    loadWeb3();
  }, []);
  const handleMint = async (parentNftName, tokenType) => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const contractAddress = '0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C'; // 你的合约地址
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        const receipt = await contract.methods
          .mintToken(parentNftName, tokenType) // 使用父NFT名称和类型
          .send({ from: account });
        const tokenIdEvent = receipt.events.Minted.returnValues.tokenId;
        let NFTInfo = localStorage.getItem('NFTInfo');
        if (NFTInfo) {
          NFTInfo = JSON.parse(NFTInfo);
          NFTInfo.push({ tokenId: tokenIdEvent, parentNftName, tokenType });
          localStorage.setItem('NFTInfo', JSON.stringify(NFTInfo));
        } else {
          NFTInfo = [{ tokenId: tokenIdEvent, parentNftName, tokenType }];
          localStorage.setItem('NFTInfo', JSON.stringify(NFTInfo));
        }
        setIsMintModalOpen(false);
        setMintedTokenId(tokenIdEvent);
        setIsDialogOpen(true);
      } catch (error) {
        console.error('Error minting NFT:', error);
      }
    }
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
                <MintModal open={isMintModalOpen} onClose={() => setIsMintModalOpen(true)} handleMint={handleMint} />
                <StakeModal open={isStakeModalOpen} onClose={() => setIsStakeModalOpen(false)} handleStake={handleStake} />
                <Typography variant="body2" color="text.secondary">
                  Create new tokens and add them to the blockchain. Minting is the process of generating new cryptocurrencies or tokens.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={() => setIsMintModalOpen(true)}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Mint Tokens
                </StyledButton>
              </Box>
              <StyledDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <Box display="flex" alignItems="center">
                    <CheckCircleOutlineIcon fontSize="large" style={{ marginRight: '10px' }} />
                    <Typography variant="h5">Mint Success</Typography>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Typography id="alert-dialog-description">
                    Your NFT has been successfully minted. You can now view the contract: 0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C and NFT ID: {mintedTokenId} to import the NFT in your wallet.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <StyledButton onClick={() => setIsDialogOpen(false)} autoFocus>
                    Close
                  </StyledButton>
                </DialogActions>
              </StyledDialog>
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
                  onClick={() => setIsStakeModalOpen(true)}
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
