import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import theme from './paperbase/theme';

function withRoot(Component: any) {
  return function WithRoot(props: object) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }
}

export default withRoot;