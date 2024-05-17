import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CircleIcon from '@mui/icons-material/Circle';
import NewPresentationModal from './components/NewPresentationModal';
import apiCallGet from '../apiCall/apiCallGet';
import apiCallPut from '../apiCall/apiCallPut';
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, createTheme, ThemeProvider } from '@mui/material';
import * as colors from '@mui/material/colors';

const Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 940,
      lg: 1200,
      xl: 1500,
    },
  },
});

export default function Presto () {
  const token = localStorage.getItem('token');
  const [presentations, setPresentations] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  // State 'cols' to manage the number of columns of grid item based on the grid container width instead of the screen width
  const [cols, setCols] = useState(3);
  // ref to the grid container
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Effect hook to handle resize events and adjust the number of columns dynamically
  useEffect(() => {
    // Define the resize handler function
    const handleResize = () => {
      // Get the current width of the container
      const width = containerRef.current ? containerRef.current.offsetWidth : 0;
      if (width < 580) {
        setCols(1);
      } else if (width < 860) {
        setCols(2);
      } else if (width < 1200) {
        setCols(3);
      } else if (width < 1536) {
        setCols(4);
      } else {
        setCols(5);
      }
    };

    // Create a ResizeObserver to observe changes in the size of the container
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    }
  }, []);

  // fetch presentations on mount
  useEffect(() => {
    apiCallGet('store', token)
      .then(body => {
        setPresentations(body.store.store.presentations);
        setUserInfo(body.store.store.userName);
      })
      .catch(error => console.error('Failed to fetch presentations:', error));
  }, []);

  // update store when presentations change
  useEffect(() => {
    apiCallGet('store', token)
      .then(body => {
        body.store.store.presentations = presentations;
        apiCallPut('store', token, body.store);
      })
      .catch(error => console.error('Failed to fetch presentations:', error));
  }, [presentations]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleCreatePresentation = (name, description) => {
    const newPresentation = {
      presentationId: 'presentation' + `${presentations.length + 1}`,
      name,
      description,
      slides: [
        {
          slideId: 1,
          content: 'title text',
          elements: []
        }
      ]
    };
    console.log(newPresentation);
    setPresentations([...presentations, newPresentation]);
  };

  const handleDoubleClick = (presentationId) => {
    navigate(`/presto/EditPresentation/${presentationId}`);
  };

  const handleDeleteClick = (presentationId) => {
    const newPresentations = presentations.filter(presentation => presentation.presentationId !== presentationId);
    setPresentations(newPresentations);
  }

  return (
        <ThemeProvider theme={Theme}>
            <Box component="main" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <CssBaseline />
                <AppBar position="static" sx={{ height: 64 }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleLogout}>
                            <PowerSettingsNewIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                          Presto
                        </Typography>
                        <Button color="inherit" variant="contained" onClick={handleOpenModal}>New deck</Button>
                    </Toolbar>
                </AppBar>
                <NewPresentationModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onCreate={handleCreatePresentation}
                />
                <Card sx={{ minWidth: 275, display: { sm: 'flex', md: 'none' }, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="h5" component="h2">
                        {userInfo}
                      </Typography>
                    </CardContent>
                    <PersonIcon sx={{ fontSize: 100, bgcolor: colors.blue[100], color: colors.blue[600] }} />
                  </Box>
                  <CardActions>
                    <Button size="small" onClick={handleOpenModal}>Upgrade</Button>
                  </CardActions>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, margin: 0, overflow: 'auto' }}>
                  <Box sx={{ height: '100%', padding: 3, display: { xs: 'none', sm: 'none', md: 'block' } }}>
                    <Card sx={{ minWidth: 275, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                          <Typography variant="h5" component="h2">
                            {userInfo}
                          </Typography>
                        </CardContent>
                        <PersonIcon sx={{ fontSize: 100, bgcolor: colors.blue[100], color: colors.blue[600] }} />
                      </Box>
                      <CardActions>
                        <Button size="small" onClick={handleOpenModal}>Upgrade</Button>
                      </CardActions>
                    </Card>
                    <Divider sx={{ mt: 2 }}/>
                    <nav aria-label="category list">
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <CircleIcon sx={{ }} />
                            </ListItemIcon>
                            <ListItemText primary="All decks"/>
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <CircleIcon sx={{ color: colors.red[500] }} />
                            </ListItemIcon>
                            <ListItemText primary="Tag 2"/>
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <CircleIcon sx={{ color: colors.orange[500] }} />
                            </ListItemIcon>
                            <ListItemText primary="Tag 3"/>
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <CircleIcon sx={{ color: colors.yellow[500] }} />
                            </ListItemIcon>
                            <ListItemText primary="Tag 4"/>
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </nav>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ my: 3 }} />
                  <Grid container ref={containerRef} spacing={2} columns={{ xs: 60 }} sx={{ flex: 1, margin: 0, height: '100%', overflow: 'auto', padding: 3, pb: '40px' }}>
                    {presentations.map(presentation => (
                      <Grid item data-testid="card-grid" xs={60 / cols} key={presentation.name} sx={{ maxHeight: '452px' }}>
                        <CardActionArea data-testid="card-actionArea" onDoubleClick={() => handleDoubleClick(presentation.presentationId)}
                          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
                        >
                          <Card variant="outlined" data-testid="card" sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                            <CardMedia
                              data-testid="card-media"
                              component="img"
                              height="140"
                              image={presentation.thumbnail || ('https://source.unsplash.com/random?wallpapers&sig=' + `${presentation.presentationId}`)}
                              alt={presentation.description}
                              sx={{ flex: '1 0 auto', mb: 1 }}
                            />
                            <CardContent data-testid="card-content" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
                              <Typography sx={{ mb: 1.5 }} color="text.secondary" component="span">
                                {presentation.description}
                              </Typography>
                              <Typography sx={{ mb: 1.5, fontSize: 10, fontFamily: 'Heiti TC' }} color="text.secondary" component="span">
                                {presentation.slides.length === 1 ? '1 slide' : `${presentation.slides.length} slides`}
                              </Typography>
                            </CardContent>
                            <CardActions data-testid="card-button">
                              <Button size="small" onClick={() => handleDoubleClick(presentation.presentationId)}>Edit</Button>
                              <Button size="small" onClick={() => handleDeleteClick(presentation.presentationId)}>Delete</Button>
                            </CardActions>
                          </Card>
                        </CardActionArea>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
            </Box>
        </ThemeProvider>
  );
}
