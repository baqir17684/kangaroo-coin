import React from 'react';
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
  { name: 'MetaMask', icon: '/api/placeholder/24/24' },
  { name: 'Phantom', icon: '/api/placeholder/24/24' },
  { name: 'Coinbase Wallet', icon: '/api/placeholder/24/24' },
];

const WalletConnectModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <GreenCircle>
          <Typography variant="h4" color="white">IP</Typography>
        </GreenCircle>
        <Typography variant="h6" color="white" align="center" gutterBottom>
          Connect to THE IP
        </Typography>
        <List>
          {walletOptions.map((wallet, index) => (
            <WalletOption key={index} button>
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
        <Button fullWidth variant="text" sx={{ color: 'white', mt: 2 }}>
          More wallet options
        </Button>
        <Typography variant="body2" color="gray" align="center" sx={{ mt: 2 }}>
          OR
        </Typography>
        <Box sx={{ display: 'flex', mt: 2 }}>
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
