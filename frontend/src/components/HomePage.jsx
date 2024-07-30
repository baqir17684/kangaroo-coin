import React from 'react';
import { Container, Card, CardMedia, CardContent, Box, Typography, Button } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// 定义动画
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 样式化组件
const DynamicBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
});

const FloatingObject = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
  animation: `${float} 6s infinite ease-in-out`,
}));

const PulsingCircle = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  border: '2px solid rgba(255,255,255,0.3)',
  animation: `${pulse} 4s infinite ease-in-out`,
}));

const RotatingPolygon = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '150px',
  height: '150px',
  background: 'linear-gradient(45deg, rgba(0,255,255,0.3) 0%, rgba(0,0,255,0.3) 100%)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  animation: `${rotate} 20s linear infinite`,
}));

const StyledCard = styled(Card)({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
});

const HomeSubpage = () => {
  return (
    <Container maxWidth="md" sx={{ mb: 6, display: 'flex', alignItems: 'center', height: '100%', flexGrow: 1, position: 'relative' }}>
      <DynamicBackground>
        <FloatingObject style={{ top: '10%', left: '10%' }} />
        <FloatingObject style={{ top: '60%', right: '5%', animationDelay: '-3s' }} />
        <PulsingCircle style={{ bottom: '15%', left: '20%' }} />
        <PulsingCircle style={{ top: '10%', right: '15%', animationDelay: '-2s' }} />
        <RotatingPolygon style={{ top: '40%', left: '5%' }} />
        <RotatingPolygon style={{ bottom: '10%', right: '10%', animationDelay: '-5s' }} />
      </DynamicBackground>

      <StyledCard sx={{ display: 'flex', bgcolor: 'transparent', boxShadow: 'none', flex: '1 0 auto' }}>
        <CardMedia
          component="img"
          sx={{ width: 400, height: 400, borderRadius: 4 }}
          image="the-ip-nft.svg"
          alt="The IP"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, mt: 8 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h3" color="white" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              The IP
            </Typography>
            <Typography variant="subtitle1" color="white" component="div" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              A collection of onchain copyrights.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" sx={{ mr: 2, bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' } }}>
                View The IP
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Follow on X
              </Button>
            </Box>
          </CardContent>
        </Box>
      </StyledCard>
    </Container>
  );
};

export default HomeSubpage;
