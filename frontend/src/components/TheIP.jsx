import React from 'react';
import { AppBar, Toolbar, Typography, Button, Card, CardMedia, CardContent, Box, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'white',
  color: 'black',
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  marginLeft: '8px',
});

const CircleBackground = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
  pointerEvents: 'none',
});

const TheIP = () => {
  return (
    <Box sx={{ bgcolor: '#8080FF', minHeight: '100vh', position: 'relative' }}>
      <CircleBackground />
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            THE IP
          </Typography>
          <StyledButton color="inherit">Create</StyledButton>
          <StyledButton color="inherit">Explore</StyledButton>
          <StyledButton color="inherit">Sell</StyledButton>
          <StyledButton color="inherit">Drops</StyledButton>
          <StyledButton variant="outlined" color="inherit">
            Connect wallet
          </StyledButton>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="md" sx={{ mt: 8, display: 'flex', alignItems: 'center' }}>
        <Card sx={{ display: 'flex', bgcolor: 'transparent', boxShadow: 'none' }}>
          <CardMedia
            component="img"
            sx={{ width: 300, height: 300, borderRadius: 4 }}
            image="/api/placeholder/300/300"
            alt="Mochimon cat"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h3" color="white">
                Mochimons
              </Typography>
              <Typography variant="subtitle1" color="white" component="div">
                A collection of 3,333 cute onchain cats rolling around on Base.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" sx={{ mr: 2, bgcolor: 'white', color: 'black' }}>
                  View Mochimons
                </Button>
                <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
                  Follow on X
                </Button>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default TheIP;
