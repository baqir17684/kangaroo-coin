import React, { useState } from 'react';
import { InputAdornment, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Slide, MenuItem } from '@mui/material';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NewTextModal ({ open, onClose, onAddText }) {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textFontSize, setTextFontSize] = useState(1);
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);

  const handleCreate = () => {
    onAddText(text, width, height, textColor, textFontSize);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} >
      <DialogTitle>Add Text</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new text, please enter: the size of the text area, text content, text font size and text color.
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
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }
          }
        />
        <TextField
          margin="dense"
          label="text content"
          type="text"
          fullWidth
          variant="standard"
          value={text}
          onChange={e => setText(e.target.value)}
          multilines
          sx={{ m: 1, width: '52ch', mb: 3 }}
        />
        <TextField
          margin='dense'
          label='text font size'
          type='number'
          variant='standard'
          value={textFontSize}
          onChange={e => setTextFontSize(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
          InputProps={
            {
              endAdornment: <InputAdornment position="end">em</InputAdornment>,
            }
          }
        />
        <TextField
          id="outlined-select-currency"
          select
          label="text color"
          defaultValue="#000000"
          onChange={e => setTextColor(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
        >
          <MenuItem value="#000000">Black</MenuItem>
          <MenuItem value="#FFFFFF">White</MenuItem>
          <MenuItem value="#FF0000">Red</MenuItem>
          <MenuItem value="#00FF00">Green</MenuItem>
          <MenuItem value="#0000FF">Blue</MenuItem>
          <MenuItem value="#FFFF00">Yellow</MenuItem>
          <MenuItem value="#FF00FF">Magenta</MenuItem>
          <MenuItem value="#00FFFF">Cyan</MenuItem>
          <MenuItem value="#FFA500">Orange</MenuItem>
          <MenuItem value="#800080">Purple</MenuItem>
          <MenuItem value='#0000FF'>Blue</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewTextModal;
