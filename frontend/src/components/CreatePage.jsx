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
import FractionModal from './FractionModal';
import FractionalizeNFTABI from './FractionalizeNFTABI.json';
import NftGenerateABI from './NftGenerateABI.json';

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
  const [isFractionModalOpen, setIsFractionModalOpen] = React.useState(false);

  const [account, setAccount] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState('');
  // const [subNftTokenId, setSubNftTokenId] = useState('');
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false);
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [isFractionDialogOpen, setIsFractionDialogOpen] = useState(false);

  const [provider, setProvider] = useState(null);
  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
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
    if (provider) {
      const web3 = new Web3(provider);
      const contractAddress = '0x346f100365a184B480aeAeC5Be0164916C27E0be'; // 你的合约地址
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        const receipt = await contract.methods
          .mintToken(parentNftName, tokenType) // 使用父NFT名称和类型
          .send({ from: account });
        const tokenIdEvent = receipt.events.Minted.returnValues.tokenId;
        console.log('NFT minted with Token ID:', tokenIdEvent);
        let NFTInfo = localStorage.getItem('NFTOriginalInfo');
        if (NFTInfo) {
          NFTInfo = JSON.parse(NFTInfo);
          NFTInfo.push({ tokenId: tokenIdEvent, parentNftName, tokenType });
          localStorage.setItem('NFTOriginalInfo', JSON.stringify(NFTInfo));
        } else {
          NFTInfo = [{ tokenId: tokenIdEvent, parentNftName, tokenType }];
          localStorage.setItem('NFTOriginalInfo', JSON.stringify(NFTInfo));
        }
        setIsMintModalOpen(false);
        setMintedTokenId(tokenIdEvent);
        setIsMintDialogOpen(true);
      } catch (error) {
        console.error('Error minting NFT:', error);
      }
    }
  };

  const stakeNFT = async (tokenId, duration, sNftType, toAddress) => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = '0x346f100365a184B480aeAeC5Be0164916C27E0be'; // NftGenerate 合约地址
        const contract = new web3.eth.Contract(NftGenerateABI, contractAddress);

        const receipt = await contract.methods
          .SubNftGenerate(tokenId, duration, sNftType, toAddress)
          .send({ from: account });

        // 从事件中提取生成的S-NFT的Token ID
        const subNftMintedEvent = receipt.events.SubNftMinted;
        if (subNftMintedEvent) {
          const generatedTokenId = subNftMintedEvent.returnValues.tokenId;
          // setSubNftTokenId(generatedTokenId); // 设置S-NFT的Token ID
          let SubNFTINFO = localStorage.getItem('SubNFTINFO');
          if (SubNFTINFO) {
            SubNFTINFO = JSON.parse(SubNFTINFO);
            SubNFTINFO.push({ tokenId: generatedTokenId, parentTokenId: tokenId, duration, sNftType, toAddress });
            localStorage.setItem('SubNFTINFO', JSON.stringify(SubNFTINFO));
          } else {
            SubNFTINFO = [{ tokenId: generatedTokenId, parentTokenId: tokenId, duration, sNftType, toAddress }];
            localStorage.setItem('SubNFTINFO', JSON.stringify(SubNFTINFO));
          }
          setIsStakeModalOpen(false);
          setIsStakeDialogOpen(true);
          console.log('S-NFT generated with Token ID:', generatedTokenId);
        }
      } catch (error) {
        console.error('Error staking NFT:', error);
      }
    } else {
      console.error('No Ethereum provider found. Please install MetaMask.');
    }
  };

  const fractionalizeNFT = async (subNftTokenId, fragmentCount, toAddress) => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = '0x0B479907E485341B4529b0293f1c12d1A5FEF834'; // FractionalizeNFT 合约地址
        const contract = new web3.eth.Contract(
          FractionalizeNFTABI,
          contractAddress
        );

        const receipt = await contract.methods
          .fractionalize(subNftTokenId, fragmentCount, toAddress)
          .send({ from: account });

        // 从事件中提取生成的碎片ID
        const fractionalizedEvent = receipt.events.Fractionalized;
        if (fractionalizedEvent) {
          const fragmentIds = fractionalizedEvent.returnValues.fragmentIds;
          // setFractionalizedIds(fragmentIds); // 存储生成的碎片ID
          let FragmentedNFTINFO = localStorage.getItem('FragmentedNFTINFO');
          if (FragmentedNFTINFO) {
            FragmentedNFTINFO = JSON.parse(FragmentedNFTINFO);
            FragmentedNFTINFO.push({ tokenId: subNftTokenId, fragmentIds, toAddress, fragmentCount });
            localStorage.setItem('FragmentedNFTINFO', JSON.stringify(FragmentedNFTINFO));
          } else {
            FragmentedNFTINFO = [{ tokenId: subNftTokenId, fragmentIds, toAddress, fragmentCount }];
            localStorage.setItem('FragmentedNFTINFO', JSON.stringify(FragmentedNFTINFO));
          }
          setIsFractionModalOpen(false);
          setIsFractionDialogOpen(true);
        }
      } catch (error) {
        console.error('Error fractionalizing NFT:', error);
      }
    } else {
      console.error('No Ethereum provider found. Please install MetaMask.');
    }
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
                <MintModal open={isMintModalOpen} onClose={() => setIsMintModalOpen(false)} handleMint={handleMint} />
                <StakeModal open={isStakeModalOpen} onClose={() => setIsStakeModalOpen(false)} handleStake={stakeNFT} />
                <FractionModal open={isFractionModalOpen} onClose={() => setIsFractionModalOpen(false)} handleFraction={fractionalizeNFT} />
                <Typography variant="body2" color="text.secondary">
                  Create new NFT and add them to the blockchain. Minting is the process of generating new cryptocurrencies.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={() => setIsMintModalOpen(true)}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Mint
                </StyledButton>
              </Box>
              <StyledDialog // Mint Dialog
                open={isMintDialogOpen}
                onClose={() => setIsMintDialogOpen(false)}
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
                    Your NFT has been successfully minted. You can now view the contract: 0x480D14391524e0DFD8f7fEad6deE9ebb96ABBa3B and NFT ID: {mintedTokenId} to import the NFT in your wallet.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <StyledButton onClick={() => setIsMintDialogOpen(false)} autoFocus>
                    Close
                  </StyledButton>
                </DialogActions>
              </StyledDialog>
              <StyledDialog // Stake Dialog
                open={isStakeDialogOpen}
                onClose={() => setIsStakeDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <Box display="flex" alignItems="center">
                    <CheckCircleOutlineIcon fontSize="large" style={{ marginRight: '10px' }} />
                    <Typography variant="h5">Stake Success</Typography>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Typography id="alert-dialog-description">
                    Your NFT has been successfully staked.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <StyledButton onClick={() => setIsStakeDialogOpen(false)} autoFocus>
                    Close
                  </StyledButton>
                </DialogActions>
              </StyledDialog>
              <StyledDialog // Fraction Dialog
                open={isFractionDialogOpen}
                onClose={() => setIsFractionDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <Box display="flex" alignItems="center">
                    <CheckCircleOutlineIcon fontSize="large" style={{ marginRight: '10px' }} />
                    <Typography variant="h5">Fraction Success</Typography>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Typography id="alert-dialog-description">
                    Your SubNFT has been successfully fractionalized.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <StyledButton onClick={() => setIsFractionDialogOpen(false)} autoFocus>
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
                  Generating time-sensitive subNFTs through stacking and licensing.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={() => setIsStakeModalOpen(true)}
                  startIcon={<AccountBalanceIcon />}
                >
                  Staking and licensing
                </StyledButton>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography gutterBottom variant="h5" component="div">
                  fragmentation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fragmented subNFTs available for product use.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  onClick={() => setIsFractionModalOpen(true)}
                  startIcon={<ShoppingCartIcon />}
                >
                  fragmentation
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
