import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const ImageUpload = ({ handleUpload }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    //   setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
      <Typography variant="h6">Upload an Image</Typography>
      <label htmlFor="icon-button-file">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <IconButton color="primary" aria-label="upload picture" component="span">
          <PhotoCamera />
        </IconButton>
      </label>
      {preview && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img src={preview} alt="Preview" style={{ width: '100%', maxWidth: '300px' }} />
        </Box>
      )}
      {preview && (
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleUpload(preview)}>
          Upload
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload;
