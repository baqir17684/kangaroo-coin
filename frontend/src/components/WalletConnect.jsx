import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  TextField,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#1e1e1e',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
}));

const GreenCircle = styled(Box)({
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px',
});

const WalletOption = styled(ListItem)({
  backgroundColor: '#2a2a2a',
  borderRadius: 8,
  marginBottom: 8,
  '&:hover': {
    backgroundColor: '#3a3a3a',
  },
});

const WalletIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 8,
});

const walletOptions = [
  { name: 'MetaMask', icon: 'metamask.png' },
  { name: 'Phantom', icon: 'ph.png' },
  { name: 'Coinbase Wallet', icon: 'coinbase.png' },
];

const WalletConnectModal = ({ open, onClose, onConnect, setCheckModalOpen }) => {
  const [connectionStatus, setConnectionStatus] = useState('');
  const handleWalletConnection = async (walletName) => {
    if (walletName !== 'MetaMask') {
      setConnectionStatus(`${walletName} connection not implemented yet.`);
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // 获取连接的账户
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnectionStatus(`Connected to MetaMask. Account: ${accounts[0]}`);
          onConnect(accounts[0]); // 通知父组件连接成功
          setTimeout(() => { onClose(); setCheckModalOpen(true) }, 2000); // 2秒后关闭模态框
        } else {
          setConnectionStatus('No accounts found. Please make sure you are logged into MetaMask.');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
        setConnectionStatus(`Error connecting to MetaMask: ${error.message}`);
      }
    } else {
      setConnectionStatus('MetaMask not detected. Please install MetaMask extension.');
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <GreenCircle sx={{ mt: 2 }}>
          <Typography variant="h4" color="white">IP</Typography>
        </GreenCircle>
        <Typography variant="h6" color="white" align="center" gutterBottom>
          Connect to THE IP
        </Typography>
        <List>
          {walletOptions.map((wallet, index) => (
            <WalletOption key={index} onClick={() => handleWalletConnection(wallet.name)}>
              <ListItemIcon>
                <WalletIcon src={wallet.icon} alt={wallet.name} />
              </ListItemIcon>
              <ListItemText primary={wallet.name} sx={{ color: 'white' }} />
              {index === 0 && (
                <Typography variant="body2" color="gray">
                  Last Used
                </Typography>
              )}
            </WalletOption>
          ))}
        </List>
        {connectionStatus && (
          <Typography color="white" align="center" sx={{ mt: 2 }}>
            {connectionStatus}
          </Typography>
        )}
        <Button fullWidth variant="text" sx={{ color: 'white', mt: 2 }}>
          More wallet options
        </Button>
        <Typography variant="body2" color="gray" align="center" sx={{ mt: 2 }}>
          OR
        </Typography>
        <Box sx={{ display: 'flex', m: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Continue with email"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'white' },
              }
            }}
          />
          <IconButton sx={{ ml: 1, bgcolor: '#4CAF50', color: 'white' }}>
            <CloseIcon sx={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default WalletConnectModal;
