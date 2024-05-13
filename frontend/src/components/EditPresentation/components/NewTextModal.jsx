import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Slide } from '@mui/material';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NewTextModal ({ open, onClose, onAddText }) {
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const handleCreate = () => {
    onAddText(text, textSize, textColor, width, height);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} >
      <DialogTitle>add text</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="text content"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={e => setText(e.target.value)}
        />
        <TextField
          margin="dense"
          label="text size"
          type="number"
          fullWidth
          variant="standard"
          value={textSize}
          onChange={e => setTextSize(e.target.value)}
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
