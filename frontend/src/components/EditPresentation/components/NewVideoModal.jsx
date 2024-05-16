import React, { useState } from 'react';
import { InputAdornment, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Slide, FormControlLabel, Switch } from '@mui/material';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function NewTextModal ({ open, onClose, onAddVideo }) {
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(40);
  const [videoURL, setVideoURL] = useState('');
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const handleCreate = () => {
    onAddVideo(width, height, videoURL, isAutoPlay);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} >
      <DialogTitle>Add Video</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new video, please enter: the size of the text area, video url, and whether the video should autoplay.
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
          label="video URL of youtube"
          type="text"
          fullWidth
          variant="standard"
          value={videoURL}
          onChange={e => setVideoURL(e.target.value)}
          multilines
          sx={{ m: 1, width: '52ch', mb: 3 }}
        />
        <FormControlLabel
          sx={{ mt: 1 }}
            control={
              <Switch checked={isAutoPlay} onChange={e => setIsAutoPlay(e.target.checked)} />
            }
          label="Auto play"
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
