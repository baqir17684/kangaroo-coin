import React, { useState } from 'react';
import { InputAdornment, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NewTextModal ({ open, onClose, onAddImage }) {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [imageURL, setImageURL] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  const handleCreate = () => {
    onAddImage(width, height, imageURL, imageDescription);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} >
      <DialogTitle>Add Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new image, please enter: the size of the image area, image url or a base64 string encoding of the whole image itself, description and alt text.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          label="width"
          type="number"
          variant="standard"
          value={width}
          onChange={e => setWidth(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
          InputProps={
            {
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }
          }
        />
        <TextField
          autoFocus
          required
          margin="dense"
          label="height"
          type="number"
          variant="standard"
          value={height}
          onChange={e => setHeight(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
          InputProps={
            {
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }
          }
        />
        <TextField
          margin="dense"
          label="image URL or base64 string"
          type="text"
          fullWidth
          variant="standard"
          value={imageURL}
          onChange={e => setImageURL(e.target.value)}
          multilines
          sx={{ m: 1, width: '52ch', mb: 3 }}
        />
        <TextField
          margin="dense"
          label="image description"
          type="text"
          fullWidth
          variant="standard"
          value={imageDescription}
          onChange={e => setImageDescription(e.target.value)}
          multilines
          sx={{ m: 1, width: '52ch', mb: 3 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewTextModal;
