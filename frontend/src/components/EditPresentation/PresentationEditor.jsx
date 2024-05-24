import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiCallGet from '../apiCall/apiCallGet';
import apiCallPut from '../apiCall/apiCallPut';
import { Drawer, Box, List, ListItemIcon, ListItemText, Typography, Divider, Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ListItemButton from '@mui/material/ListItemButton';
import ImageIcon from '@mui/icons-material/Image';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Tooltip from '@mui/material/Tooltip';
import html2canvas from 'html2canvas';
import { useState, useEffect, useRef, useCallback } from 'react';
import NewTextModal from './components/NewTextModal';
// import NewCodeModal from './components/NewCodeModal';
import NewImageModal from './components/NewImageModal';
import NewVideoModal from './components/NewVideoModal';
import DraggableElement from './components/DraggableElement';
import { useDrop } from 'react-dnd';

const addCode = () => console.log('');

function PresentationEditor () {
  const { presentationId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState('');
  const [currentSlide, setSlide] = useState('');
  const paperRef = useRef(null);
  useEffect(() => {
    apiCallGet('store', token)
      .then(body => {
        setPresentation(body.store.store.presentations.find(presentation => presentation.presentationId === presentationId));
        setSlide(body.store.store.presentations.find(presentation => presentation.presentationId === presentationId).slides[0]);
        captureAndSendThumbnail();
      })
  }, []);
  useEffect(() => {
    apiCallGet('store', token)
      .then(body => {
        body.store.store.presentations = body.store.store.presentations.map(presentation0 => presentation0.presentationId === presentation.presentationId ? presentation : presentation0);
        apiCallPut('store', token, body.store);
      })
  }, [presentation]);
  const [{ isOver }, drop] = useDrop({
    accept: 'Box',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (paperRef.current) {
        const { width, height } = paperRef.current.getBoundingClientRect();
        delta.x = delta.x / width * 100;
        delta.y = delta.y / height * 100;
        const x = Math.round(item.x + delta.x);
        const y = Math.round(item.y + delta.y);
        handlePositionUpgrade(item.eleID, { x, y });
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });
  // text modal
  const [openTextModal, setOpenTextModal] = useState(false);
  const handleOpenTextModal = () => setOpenTextModal(true);
  const handleCloseTextModal = () => setOpenTextModal(false);
  const addTextToSlide = (text, textWidth, textHeight, textColor, textFontSize) => {
    const textElement = {
      eleID: currentSlide.elements.length,
      type: 'text',
      content: text,
      color: textColor,
      width: textWidth,
      height: textHeight,
      fontSize: textFontSize,
    };
    const updatedSlide = { ...currentSlide, elements: [...currentSlide.elements, textElement] };
    const updatedSlides = presentation.slides.map(slide =>
      slide.slideId === currentSlide.slideId ? updatedSlide : slide
    );
    setPresentation(presentation => ({
      ...presentation,
      slides: updatedSlides,
    }));
    setSlide(updatedSlide);

    handleCloseTextModal();
  };

  // image modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const handleOpenImageModal = () => setOpenImageModal(true);
  const handleCloseImageModal = () => setOpenImageModal(false);
  const addImageToSlide = (imageWidth, imageHeight, imageURL, imageDesciption) => {
    const imageElement = {
      eleID: currentSlide.elements.length,
      type: 'image',
      url: imageURL,
      description: imageDesciption,
      width: imageWidth,
      height: imageHeight,
    };
    const updatedSlide = { ...currentSlide, elements: [...currentSlide.elements, imageElement] };
    const updatedSlides = presentation.slides.map(slide =>
      slide.slideId === currentSlide.slideId ? updatedSlide : slide
    );
    setPresentation(presentation => ({
      ...presentation,
      slides: updatedSlides,
    }));
    setSlide(updatedSlide);

    handleCloseImageModal();
  };

  // video modal
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const handleOpenVideoModal = () => setOpenVideoModal(true);
  const handleCloseVideoModal = () => setOpenVideoModal(false);
  const addVideoToSlide = (videoWidth, videoHeight, videoURL, isAutoPlay) => {
    const videoElement = {
      eleID: currentSlide.elements.length,
      type: 'video',
      url: videoURL,
      width: videoWidth,
      height: videoHeight,
      autoPlay: isAutoPlay,
    };
    const updatedSlide = { ...currentSlide, elements: [...currentSlide.elements, videoElement] };
    const updatedSlides = presentation.slides.map(slide =>
      slide.slideId === currentSlide.slideId ? updatedSlide : slide
    );
    setPresentation(presentation => ({
      ...presentation,
      slides: updatedSlides,
    }));
    setSlide(updatedSlide);

    handleCloseVideoModal();
  };

  const deleteSomething = () => {
    apiCallGet('store', token)
      .then(body => {
        body.store.store.presentations = body.store.store.presentations.filter(presentation => presentation.presentationId !== presentationId);
        apiCallPut('store', token, body.store);
        navigate('/presto');
      })
      .catch(error => console.error('Failed to fetch presentations:', error));
  };
  const signOut = () => {
    navigate('/presto');
  };

  const captureAndSendThumbnail = () => {
    const element = document.getElementById('element-to-capture');
    if (element) {
      html2canvas(element).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        setPresentation(presentation => ({ ...presentation, thumbnail: imageData }));
      });
    }
  };

  const deleteSlide = () => {
    setPresentation(presentation => {
      if (presentation.slides.length === 1) {
        alert('Cannot delete the only slide');
        return presentation;
      } else {
        const slides = presentation.slides.filter(slide => slide.slideId !== currentSlide.slideId);
        if (currentSlide.slideId === 1) {
          setSlide(slides[0]);
        } else {
          setSlide(slides[currentSlide.slideId - 2]);
        }
        return { ...presentation, slides };
      }
    });
  };

  const createNewSlide = () => {
    setPresentation(presentation => {
      const slides = presentation.slides;
      slides.push({ slideId: slides.length + 1, elements: [] });
      setSlide(slides[slides.length - 1]);
      return { ...presentation, slides };
    });
  };

  const editTitle = () => {
    const newTitle = prompt('Enter new title');
    setPresentation(presentation => ({ ...presentation, name: newTitle }));
  };

  const previousSilde = () => {
    setPresentation(presentation => {
      const slides = presentation.slides;
      const index = slides.findIndex(slide => slide.slideId === currentSlide.slideId);
      if (index === 0) {
        alert('No previous slide');
        return presentation;
      } else {
        setSlide(slides[index - 1]);
        return presentation;
      }
    });
  };

  const nextSlide = () => {
    setPresentation(presentation => {
      const slides = presentation.slides;
      const index = slides.findIndex(slide => slide.slideId === currentSlide.slideId);
      if (index === slides.length - 1) {
        alert('No next slide');
        return presentation;
      } else {
        setSlide(slides[index + 1]);
        return presentation;
      }
    });
  };

  const handlePositionUpgrade = (eleID, position) => {
    const updatedElements = currentSlide.elements.map(element =>
      element.eleID === eleID ? { ...element, xPosition: position.x, yPosition: position.y } : element
    )
    const updatedSlide = { ...currentSlide, elements: updatedElements };
    const updatedSlides = presentation.slides.map(slide =>
      slide.slideId === currentSlide.slideId ? updatedSlide : slide
    );
    setPresentation(presentation => ({
      ...presentation,
      slides: updatedSlides,
    }));
    setSlide(updatedSlide);
    if (isOver) {
      console.log('Dragging over drop area');
    }
  };

  const combineRef = useCallback(node => {
    drop(node);
    paperRef.current = node;
  });
  return (
    <Box display="flex" height="100vh">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 135,
        }}
      >
        <List sx={{ flex: 1 }}>
          {/* text */}
          <ListItemButton onClick={handleOpenTextModal}>
            <ListItemIcon>
              <TextFieldsIcon />
            </ListItemIcon>
            <ListItemText primary="Text" />
          </ListItemButton>
          <NewTextModal open={openTextModal} onClose={handleCloseTextModal} onAddText={addTextToSlide} />
          {/* img */}
          <ListItemButton onClick={handleOpenImageModal}>
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary="Image" />
          </ListItemButton>
          <NewImageModal open={openImageModal} onClose={handleCloseImageModal} onAddImage={addImageToSlide} />

          {/* video */}
          <ListItemButton onClick={handleOpenVideoModal}>
            <ListItemIcon>
              <OndemandVideoIcon />
            </ListItemIcon>
            <ListItemText primary="Video" />
          </ListItemButton>
          <NewVideoModal open={openVideoModal} onClose={handleCloseVideoModal} onAddVideo={addVideoToSlide} />

          {/* code */}
          <ListItemButton onClick={addCode}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary="Code" />
          </ListItemButton>
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={deleteSomething}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItemButton>
        </List>
        <List>
          <ListItemButton onClick={signOut}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Return" />
          </ListItemButton>
        </List>
      </Drawer>

      <Grid container sx={{ bgcolor: 'grey.500' }}>
        <Grid item container id='element-to-capture' xs={12} sx={{
          ml: 8,
          mr: 8,
          mt: 10,
          mb: 10,
          display: 'flex',
          flexGrow: 1,
          position: 'relative',
        }}>
          <Typography
            variant="h6"
            color="white"
            sx={{
              position: 'absolute',
              top: -60,
              left: '50%',
              width: '20%',
              transform: 'translateX(-50%)',
              bgcolor: 'purple',
              textAlign: 'center',
              px: 2,
              py: 1,
            }}
          >
            {presentation.name || `${presentationId}`}
          </Typography>

          <Typography variant="h6" color="white"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              bgcolor: 'orange',
              textAlign: 'center',
              px: 2,
              py: 1,
              zIndex: 100,
            }}
            >
              {currentSlide.slideId}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: -40,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'secondary.main',
              zIndex: 100
            }}
          >
            <Tooltip title="delete current slide" placement="top" arrow>
              <IconButton color="inherit" onClick={deleteSlide} sx={{ mb: 1 }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="create new slide" placement="top" arrow>
              <IconButton color="inherit" onClick={createNewSlide} sx={{ mb: 1 }}>
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="edit presentation title" placement="top" arrow>
              <IconButton color="inherit" onClick={editTitle}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            {currentSlide.slideId !== 1 && (
              <Tooltip title="previous slide" placement="top" arrow>
                <IconButton color="inherit" onClick={previousSilde}>
                  <KeyboardArrowUpIcon />
                </IconButton>
              </Tooltip>
            )}
            {presentation.slides && currentSlide && currentSlide.slideId !== presentation.slides.length && (
              <Tooltip title="next slide" placement="top" arrow>
                <IconButton color="inherit" onClick={nextSlide}>
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Paper
            ref = {combineRef}
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'white',
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {currentSlide.elements && currentSlide.elements.map((element) => (
              <DraggableElement key={element.eleID} element={element} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PresentationEditor;
