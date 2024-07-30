import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Card, CardMedia, CardContent, Box, Container, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import WalletConnectModal from './WalletConnect';
import CheckModal from './CheckModal';
import CreatePage from './CreatePage';
import MyNFTPage from './MyNFTPage';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'black',
  color: 'white',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  marginLeft: '8px',
});

const CircleBackground = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
  pointerEvents: 'none',
});

const IconImage = styled('img')(({ theme }) => ({
  width: 36,
  height: 36,
  marginRight: theme.spacing(1),
}));

const TheIP = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [subPage, setSubPage] = useState('home');
  const handleConnect = (account) => {
    setConnectedAccount(account);
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  return (
    <Box sx={{ bgcolor: '#8080FF', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <CircleBackground />
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <IconImage
            src="THEIP.jpg"
            alt="Logo"
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            THE IP
          </Typography>
          <StyledButton color="inherit" onClick={() => setSubPage('home')}>Home</StyledButton>
          <StyledButton color="inherit" onClick={() => setSubPage('create')}>Create</StyledButton>
          <StyledButton color="inherit" onClick={() => setSubPage('myNFT')}>My NFT</StyledButton>
          <StyledButton color="inherit">Drops</StyledButton>
          {connectedAccount
            ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} src="metamask.png" alt="MetaMask" />
              <Typography variant="body2">{truncateAddress(connectedAccount)}</Typography>
            </Box>
              )
            : (
            <StyledButton variant="outlined" color="inherit" onClick={() => setIsModalOpen(true)}>
              Connect wallet
            </StyledButton>
              )}
          <WalletConnectModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConnect={handleConnect} setCheckModalOpen={setCheckModalOpen} />
          <CheckModal open={checkModalOpen} onClose={() => setCheckModalOpen(false)} />
        </Toolbar>
      </StyledAppBar>
      {subPages(subPage)}
    </Box>
  );
};

const subPages = (state) => {
  switch (state) {
    case 'home':
      return (
        <Container maxWidth="md" sx={{ mb: 6, display: 'flex', alignItems: 'center', height: '100%', flexGrow: 1 }}>
        <Card sx={{ display: 'flex', bgcolor: 'transparent', boxShadow: 'none', flex: '1 0 auto' }}>
          <CardMedia
            component="img"
            sx={{ width: 400, height: 400, borderRadius: 4 }}
            image="Mcat.jpg"
            alt="Mcat"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, mt: 8 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h3" color="white">
                Mcat
              </Typography>
              <Typography variant="subtitle1" color="white" component="div">
                A collection of 33 cute onchain cats rolling around on Base.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" sx={{ mr: 2, bgcolor: 'white', color: 'black' }}>
                  View Mcat
                </Button>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
                  Follow on X
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Container>
      )
    case 'create':
      return <CreatePage />;
    case 'myNFT':
      return <MyNFTPage />;
  }
}
export default TheIP;
