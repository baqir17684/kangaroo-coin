import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 15,
    padding: theme.spacing(2),
    background: 'linear-gradient(45deg, #46FE6B 30%, #53FFD1 90%)',
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

const LoadingButton = styled(Button)({
  background: 'white',
  color: '#46FE6B',
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.7)',
    color: '#46FE6B',
  },
});

const FractionalizeNFTModal = ({ open, onClose, handleFraction }) => {
  const [subNftTokenId, setSubNftTokenId] = useState('');
  const [fragmentCount, setFragmentCount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    handleFraction(subNftTokenId, fragmentCount, toAddress);
  };

  const handleCancel = () => {
    onClose();
    setIsLoading(false);
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
              Fractionalize Sub-NFT
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <StyledTextField
                autoFocus
                margin="dense"
                id="subNftTokenId"
                label="Sub-NFT Token ID"
                type="text"
                fullWidth
                variant="outlined"
                value={subNftTokenId}
                onChange={(e) => setSubNftTokenId(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledTextField
                margin="dense"
                id="fragmentCount"
                label="Fragment Count"
                type="number"
                fullWidth
                variant="outlined"
                value={fragmentCount}
                onChange={(e) => setFragmentCount(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledTextField
                margin="dense"
                id="toAddress"
                label="Recipient Address"
                type="text"
                fullWidth
                variant="outlined"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} style={{ color: 'white' }}>Cancel</Button>
            <LoadingButton
              onClick={onSubmit}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Fractionalize'}
            </LoadingButton>
          </DialogActions>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default FractionalizeNFTModal;
