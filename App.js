import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Grid, Slider, AppBar, Toolbar, Box } from '@mui/material';

// Remove Supabase client creation as it's not needed in the frontend

function App() {
  const [oddsData, setOddsData] = useState([]);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [betAmount, setBetAmount] = useState(100);

  // Use environment variable for API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchOdds();
  }, []);

  const fetchOdds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/odds`);
      setOddsData(response.data);
    } catch (error) {
      console.error('Error fetching odds:', error);
    }
    setLoading(false);
  };

  const checkArbitrage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/check-arbitrage`);
      setArbitrageOpportunities(response.data);
    } catch (error) {
      console.error('Error checking arbitrage:', error);
    }
    setLoading(false);
  };

  const OddsDisplay = ({ oddsData }) => (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', mt: 2 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Sport</TableCell>
            <TableCell>Home Team</TableCell>
            <TableCell>Away Team</TableCell>
            <TableCell>Bookmaker</TableCell>
            <TableCell>Market Type</TableCell>
            <TableCell>Outcome Team</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oddsData.map((odd, index) => (
            <TableRow key={index}>
              <TableCell>{odd.sport_title}</TableCell>
              <TableCell>{odd.home_team}</TableCell>
              <TableCell>{odd.away_team}</TableCell>
              <TableCell>{odd.bookmaker}</TableCell>
              <TableCell>{odd.market_type}</TableCell>
              <TableCell>{odd.outcome_team}</TableCell>
              <TableCell>{odd.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const ArbitrageOpportunities = ({ opportunities, betAmount }) => (
    <Grid container spacing={2}>
      {opportunities.map((opportunity, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {opportunity.home_team} vs {opportunity.away_team}
              </Typography>
              <Typography color="textSecondary">
                Profit Margin: {opportunity.profitMargin}%
              </Typography>
              <Typography variant="body2" component="p">
                Home: {opportunity.homeBookmaker} ({(opportunity.betProportionHome * 100).toFixed(2)}%)
                <br />
                Bet: ${(betAmount * opportunity.betProportionHome).toFixed(2)}
              </Typography>
              <Typography variant="body2" component="p">
                Away: {opportunity.awayBookmaker} ({(opportunity.betProportionAway * 100).toFixed(2)}%)
                <br />
                Bet: ${(betAmount * opportunity.betProportionAway).toFixed(2)}
              </Typography>
              {opportunity.drawBookmaker && (
                <Typography variant="body2" component="p">
                  Draw: {opportunity.drawBookmaker} ({(opportunity.betProportionDraw * 100).toFixed(2)}%)
                  <br />
                  Bet: ${(betAmount * opportunity.betProportionDraw).toFixed(2)}
                </Typography>
              )}
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                Potential Profit: ${(betAmount * (opportunity.profitMargin / 100)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '50px' }}>
      <AppBar position="static" style={{ backgroundColor: '#3f51b5', color: '#fff', marginBottom: '16px' }}>
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            Sports Arbitrage Finder
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button variant="contained" color="primary" style={{ marginRight: '8px' }} onClick={fetchOdds} disabled={loading}>
            Fetch Odds
          </Button>
          <Button variant="contained" color="secondary" onClick={checkArbitrage} disabled={loading}>
            Check Arbitrage
          </Button>
          {loading && <CircularProgress style={{ marginLeft: '16px' }} />}
        </Box>

        {oddsData.length > 0 && (
          <Box sx={{ marginTop: 2, marginBottom: 2 }}>
            <Typography variant="h5">
              Latest Odds
            </Typography>
            <OddsDisplay oddsData={oddsData} />
          </Box>
        )}

        {arbitrageOpportunities.length > 0 ? (
          <Box sx={{ marginTop: 2, marginBottom: 2 }}>
            <Typography variant="h5">
              Arbitrage Opportunities (always check before betting)
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Bet Amount: ${betAmount}
            </Typography>
            <Slider
              value={betAmount}
              onChange={(_, newValue) => setBetAmount(newValue)}
              aria-labelledby="bet-amount-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={1000}
              style={{ width: '80%', marginBottom: '16px' }}
            />
            <ArbitrageOpportunities opportunities={arbitrageOpportunities} betAmount={betAmount} />
          </Box>
        ) : (
          <Typography variant="body1" style={{ marginTop: '16px' }}>
            No arbitrage opportunities available.
          </Typography>
        )}
      </Container>
    </div>
  );
}

export default App;