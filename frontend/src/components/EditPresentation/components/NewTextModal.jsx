import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function NewTextModal ({ open, onClose, onTextChange, onTextSizeChange, onTextColorChange, onAddText }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    onCreate(name, description);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>add text</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="presentation name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="presentation description"
          type="text"
          fullWidth
          variant="standard"ds
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={4}
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
