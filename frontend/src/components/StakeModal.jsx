import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 15,
    padding: theme.spacing(2),
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
}));

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  input: { color: 'white' },
  label: { color: 'white' }
});

const StakeModal = ({ open, onClose, handleStake }) => {
  const [tokenId, setTokenId] = useState('');
  const [duration, setDuration] = useState('');
  const [sNftType, setSNftType] = useState('');
  const [toAddress, setToAddress] = useState('');

  const onSubmit = () => {
    handleStake(tokenId, duration, sNftType, toAddress);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <StyledDialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          PaperComponent={motion.div}
          PaperProps={{
            initial: { y: -50, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -50, opacity: 0 },
            transition: { type: 'spring', stiffness: 300, damping: 30 }
          }}
        >
          <DialogTitle>
            <Typography variant="h4" component="div" style={{ color: 'white', fontWeight: 'bold' }}>
              Stake Your NFT
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <StyledTextField
                autoFocus
                margin="dense"
                id="tokenId"
                label="Token ID to Stake"
                type="text"
                fullWidth
                variant="outlined"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledTextField
                margin="dense"
                id="duration"
                label="Duration (days)"
                type="number"
                fullWidth
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledTextField
                margin="dense"
                id="sNftType"
                label="Sub-NFT Type"
                type="text"
                fullWidth
                variant="outlined"
                value={sNftType}
                onChange={(e) => setSNftType(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledTextField
                margin="dense"
                id="toAddress"
                label="To Address"
                type="text"
                fullWidth
                variant="outlined"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} style={{ color: 'white' }}>Cancel</Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              style={{
                background: 'white',
                color: '#2196F3'
              }}
            >
              Stake
            </Button>
          </DialogActions>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default StakeModal;
