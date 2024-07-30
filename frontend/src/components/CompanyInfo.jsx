import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Chip, Link } from '@mui/material';
import { styled } from '@mui/system';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import InfoIcon from '@mui/icons-material/Info';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const CompanyLogo = styled(CardMedia)(({ theme }) => ({
  height: 200,
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CompanyInfoCard = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem('companyInfo');
    if (storedInfo) {
      setCompanyInfo(JSON.parse(storedInfo));
    }
  }, []);

  if (!companyInfo) {
    return <Typography>Loading company information...</Typography>;
  }

  return (
    <StyledCard elevation={3}>
      <CompanyLogo
        image={companyInfo.logo_url}
        title={companyInfo.company_name}
      />
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {companyInfo.company_name}
        </Typography>
        <Box my={2}>
          <InfoChip icon={<BusinessIcon />} label="Tech Company" />
          <InfoChip icon={<LanguageIcon />} label="Worldwide" />
          <InfoChip icon={<InfoIcon />} label="Founded in 1998" />
        </Box>
        <Typography variant="body1" paragraph>
          {companyInfo.summary.split('.')[0]}. {/* Display only the first sentence of the summary */}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Key Products:
            </Typography>
            <Typography variant="body2">
              • Android
              • Google Search
              • Google Cloud
              • Google Workspace
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Industry Focus:
            </Typography>
            <Typography variant="body2">
              • Internet Services
              • Cloud Computing
              • Artificial Intelligence
              • Online Advertising
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Link href={companyInfo.url} target="_blank" rel="noopener noreferrer">
            Visit Official Website
          </Link>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CompanyInfoCard;
