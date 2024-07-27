import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Input,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CheckModal = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file');
      event.target.value = null;
    }
  };

  const handleSubmit = () => {
    if (name && file) {
      console.log('Name:', name);
      console.log('File:', file);
      // Here you would typically send the data to a server
      onClose();
    } else {
      alert('Please enter a name and upload a PDF file');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="check-modal-title"
      aria-describedby="check-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="check-modal-title" variant="h6" component="h2" gutterBottom >
          Upload PDF and Enter Name
        </Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          margin="normal"
        />
        <Input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="pdf-upload"
          inputProps={{ accept: 'application/pdf' }}
        />
        <label htmlFor="pdf-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Upload PDF
          </Button>
        </label>
        {file && (
          <Typography variant="body2" gutterBottom>
            Selected file: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default CheckModal;
