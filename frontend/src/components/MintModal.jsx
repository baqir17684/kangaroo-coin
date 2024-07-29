import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
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
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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

const StyledSelect = styled(Select)({
  color: 'white',
  '&:before': {
    borderColor: 'white',
  },
  '&:after': {
    borderColor: 'white',
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
});

const MintModal = ({ open, onClose, handleMint }) => {
  const [parentNftName, setParentNftName] = useState('');
  const [tokenType, setTokenType] = useState('CopyRight');

  const onSubmit = () => {
    handleMint(parentNftName, tokenType);
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
              Mint Your NFT
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box my={2}>
              <StyledTextField
                autoFocus
                margin="dense"
                id="parentNftName"
                label="Parent NFT Name"
                type="text"
                fullWidth
                variant="outlined"
                value={parentNftName}
                onChange={(e) => setParentNftName(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <StyledSelect
                value={tokenType}
                onChange={(e) => setTokenType(e.target.value)}
                fullWidth
              >
                <MenuItem value="CopyRight">Copyright</MenuItem>
                <MenuItem value="TradeMark">Trademark</MenuItem>
              </StyledSelect>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} style={{ color: 'white' }}>Cancel</Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              style={{
                background: 'white',
                color: '#FE6B8B'
              }}
            >
              Mint
            </Button>
          </DialogActions>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default MintModal;
