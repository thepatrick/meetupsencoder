import { Hidden, withWidth } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { mobileOpen } from './actions';
import { history } from "./configureStore";
import HomePage from './pages/HomePage';
import Navigator from './paperbase/Navigator';
import { drawerWidth } from './paperbase/theme';
import { RootState } from './reducers';
import withRoot from './withRoot';

// const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}), { name: 'App' });

function Routes({ className }: { className: string }) {
  return (
    <div className={className}>
      <Route exact={true} path="/" component={HomePage} />
			{/* <Route exact={true} path="/todo" component={TodoPage} /> */}
    </div>
  );
}

interface AppProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const App: FC<AppProps> = ({ mobileOpen, setMobileOpen, ...props }) => {
  const classes = useStyles(props);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router history={history}>
      <div className={classes.root}>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <Routes className={classes.appContent} />
      </div>
    </Router>
  );
}

function mapStateToProps(state: RootState) {
  return {
    mobileOpen: state.mobileOpen,
    // todoList: state.todoList,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    setMobileOpen(open: boolean) {
      dispatch(mobileOpen(open));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRoot(withWidth()(App)));
