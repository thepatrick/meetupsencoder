import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';
import ShowMobileMenu from './ShowMobileMenu';

const HomePageHeader: FC = () => (
  <React.Fragment>
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar>
        <Grid container spacing={1} alignItems="center">
          <ShowMobileMenu />
          <Grid item xs />
        </Grid>
      </Toolbar>
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography color="inherit" variant="h5" component="h1">
              Welcome to Automatic Pancake
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default HomePageHeader;