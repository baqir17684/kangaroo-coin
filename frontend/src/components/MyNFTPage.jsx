import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Paper,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledColumn = styled(Paper)(({ color }) => ({
  height: '100%',
  padding: '16px',
  background: `linear-gradient(45deg, ${color} 30%, #ffffff 90%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientAnimation} 5s ease infinite`,
  borderRadius: '4px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: '0.3s',
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-5px) rotate(2deg)',
    boxShadow: '0 8px 20px 0 rgba(0,0,0,0.2)',
  },
});

const ColumnHeader = styled(Typography)({
  textAlign: 'center',
  marginBottom: '16px',
  fontWeight: 'bold',
  color: '#ffffff',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
});

const CardTitle = styled(Typography)({
  color: '#FFD700', // Gold color for the title
  fontWeight: 'bold',
  marginBottom: '8px',
});

const CardText = styled(Typography)({
  color: '#00FFFF', // Cyan color for the text
  marginBottom: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const MyNFTPage = () => {
  const [parentNFTs, setParentNFTs] = useState([]);

  useEffect(() => {
    const NFTInfo = JSON.parse(localStorage.getItem('NFTOriginalInfo') || '[]');
    setParentNFTs(NFTInfo);
  }, []);

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Grid container spacing={3}>
          {/* Parent NFT Column */}
          <Grid item xs={12} md={4}>
            <StyledColumn color="#FF6B6B">
              <ColumnHeader variant="h5">Parent NFTs</ColumnHeader>
              <Grid container spacing={2}>
                {parentNFTs.map((nft, index) => (
                  <Grid item xs={12} key={index}>
                    <StyledCard>
                      <CardContent>
                        <CardTitle variant="h6">
                          {nft.parentNftName}
                        </CardTitle>
                        <Tooltip title={`NFT ID: ${nft.tokenId}`} arrow placement="top">
                          <CardText>
                            NFT ID: {nft.tokenId}
                          </CardText>
                        </Tooltip>
                        <CardText>
                          Type: {nft.tokenType}
                        </CardText>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            </StyledColumn>
          </Grid>

          {/* Sub NFT Column */}
          <Grid item xs={12} md={4}>
            <StyledColumn color="#4ECDC4">
              <ColumnHeader variant="h5">Sub NFTs</ColumnHeader>
              <Typography variant="body1" align="center" style={{ color: '#000000' }}>
                Sub NFT content will be displayed here.
              </Typography>
            </StyledColumn>
          </Grid>

          {/* Fragment NFT Column */}
          <Grid item xs={12} md={4}>
            <StyledColumn color="#45B7D1">
              <ColumnHeader variant="h5">Fragment NFTs</ColumnHeader>
              <Typography variant="body1" align="center" style={{ color: '#000000' }}>
                Fragment NFT content will be displayed here.
              </Typography>
            </StyledColumn>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MyNFTPage;
