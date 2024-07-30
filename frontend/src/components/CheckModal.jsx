import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Input,
  CircularProgress,
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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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

  const handleSubmit = async () => {
    if (name && file) {
      setIsLoading(true);
      setUploadResult(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      try {
        const response = await fetch('http://localhost:5000/upload_pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setUploadResult({
            success: true,
            message: `File uploaded successfully. IPFS hash: ${data.ipfs_hash}`,
          });
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadResult({
          success: false,
          message: `Upload failed: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
      // get company info
      try {
        const response = await fetch('http://127.0.0.1:5000/company-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ company_name: name })
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          localStorage.setItem('companyInfo', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error fetching company info:', err);
      }
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
        <Typography id="check-modal-title" variant="h6" component="h2" gutterBottom>
          Upload the required PDF and enter the company name for verification
        </Typography>
        <TextField
          fullWidth
          label="Company Name"
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
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
        {uploadResult && (
          <Typography
            variant="body2"
            color={uploadResult.success ? 'success.main' : 'error.main'}
            sx={{ mt: 2 }}
          >
            {uploadResult.message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default CheckModal;
