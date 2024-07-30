import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Paper,
  Tooltip,
  IconButton,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
});

const IdContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const IdText = styled(Typography)({
  color: '#00FFFF',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexGrow: 1,
  marginRight: '8px',
});

const CopyButton = styled(IconButton)({
  padding: 4,
  flexShrink: 0,
});

const MyNFTPage = () => {
  const [parentNFTs, setParentNFTs] = useState([]);
  const [subNFTs, setSubNFTs] = useState([]);
  const [fragmentNFTs, setFragmentNFTs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const NFTInfo = JSON.parse(localStorage.getItem('NFTOriginalInfo') || '[]');
    setParentNFTs(NFTInfo);

    const SubNFTINFO = JSON.parse(localStorage.getItem('SubNFTINFO') || '[]');
    setSubNFTs(SubNFTINFO);

    const FragmentedNFTINFO = JSON.parse(localStorage.getItem('FragmentedNFTINFO') || '[]');
    setFragmentNFTs(FragmentedNFTINFO);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  };

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
                          <IdContainer>
                            <IdText>NFT ID: {nft.tokenId}</IdText>
                            <CopyButton onClick={() => copyToClipboard(nft.tokenId)}>
                              <ContentCopyIcon fontSize="small" />
                            </CopyButton>
                          </IdContainer>
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
              <Grid container spacing={2}>
                {subNFTs.map((subNFT, index) => (
                  <Grid item xs={12} key={index}>
                    <StyledCard>
                      <CardContent>
                        <CardTitle variant="h6">
                          Sub NFT
                        </CardTitle>
                        <Tooltip title={`Token ID: ${subNFT.tokenId}`} arrow placement="top">
                          <IdContainer>
                            <IdText>Token ID: {subNFT.tokenId}</IdText>
                            <CopyButton onClick={() => copyToClipboard(subNFT.tokenId)}>
                              <ContentCopyIcon fontSize="small" />
                            </CopyButton>
                          </IdContainer>
                        </Tooltip>
                        <Tooltip title={`Parent Token ID: ${subNFT.parentTokenId}`} arrow placement="top">
                          <CardText>
                            Parent Token ID: {subNFT.parentTokenId}
                          </CardText>
                        </Tooltip>
                        <CardText>
                          Duration: {subNFT.duration} days
                        </CardText>
                        <CardText>
                          Type: {subNFT.sNftType}
                        </CardText>
                        <Tooltip title={`To Address: ${subNFT.toAddress}`} arrow placement="top">
                          <CardText>
                            Keeper: {subNFT.toAddress.slice(0, 6)}...{subNFT.toAddress.slice(-4)}
                          </CardText>
                        </Tooltip>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            </StyledColumn>
          </Grid>

          {/* Fragment NFT Column */}
          <Grid item xs={12} md={4}>
            <StyledColumn color="#45B7D1">
              <ColumnHeader variant="h5">Fragment NFTs</ColumnHeader>
              <Grid container spacing={2}>
                {fragmentNFTs.map((fragmentNFT, index) => (
                  <Grid item xs={12} key={index}>
                    <StyledCard>
                      <CardContent>
                        <CardTitle variant="h6">
                          Fragmented NFT
                        </CardTitle>
                        <Tooltip title={`Original Sub NFT ID: ${fragmentNFT.tokenId}`} arrow placement="top">
                          <CardText>
                            Original Sub NFT ID: {fragmentNFT.tokenId.slice(0, 6)}...{fragmentNFT.tokenId.slice(-4)}
                          </CardText>
                        </Tooltip>
                        <CardText>
                          Fragment Count: {fragmentNFT.fragmentCount}
                        </CardText>
                        <Tooltip title={`Fragment IDs: ${fragmentNFT.fragmentIds.join(', ')}`} arrow placement="top">
                          <CardText>
                            Fragment IDs: {fragmentNFT.fragmentIds.length > 0 ? `${fragmentNFT.fragmentIds[0].slice(0, 6)}...${fragmentNFT.fragmentIds[0].slice(-4)}, ...` : 'N/A'}
                          </CardText>
                        </Tooltip>
                        <Tooltip title={`To Address: ${fragmentNFT.toAddress}`} arrow placement="top">
                          <CardText>
                            Recipient: {fragmentNFT.toAddress.slice(0, 6)}...{fragmentNFT.toAddress.slice(-4)}
                          </CardText>
                        </Tooltip>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            </StyledColumn>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
      />
    </Container>
  );
};

export default MyNFTPage;
