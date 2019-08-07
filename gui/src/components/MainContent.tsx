import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { mainContent } from "../paperbase/theme";

const useStyles = makeStyles({
  mainContent,
}, { name: 'MainContent' });

const MainContent: FunctionComponent = ({ children }) => {
  const {mainContent} = useStyles();

  return <main className={mainContent}>
    {children}
  </main>;
};

export default MainContent;