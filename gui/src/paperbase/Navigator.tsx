import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme, withStyles } from '@material-ui/core/styles';
import DnsRoundedIcon from '@material-ui/icons/DnsRounded';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PermMediaOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActual';
import SettingsIcon from '@material-ui/icons/Settings';
import TimerIcon from '@material-ui/icons/Timer';
import clsx from 'clsx';
import React from 'react';
import NavigatorGroupList from '../components/NavigatorGroupList';
import { history } from "../configureStore";
import Lock from '@material-ui/icons/Lock';

const categories = [
  {
    id: 'Machinery',
    children: [
      { id: 'Users', icon: <PeopleIcon /> },
      { id: 'Encoders', icon: <TimerIcon /> },
      { id: 'Settings', icon: <SettingsIcon /> },
      { id: 'Events', icon: <DnsRoundedIcon /> },
      { id: 'Talks', icon: <PermMediaOutlinedIcon /> },
    ]
  }
  // { id: 'Functions', icon: <SettingsEthernetIcon /> },
  // { id: 'ML Kit', icon: <SettingsInputComponentIcon /> },
  // { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
];

const styles = (theme: Theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

interface NavigatorProps {
  classes: {[key: string]: string;};
  PaperProps: any;
  variant?: any;
  open?: any;
  onClose?: any;
}

function Navigator(props: NavigatorProps) {
  const { classes, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          Rough Cut
        </ListItem>

        <ListItem button className={clsx(classes.item, classes.itemCategory)} onClick={() => history.push("/")}>
          <ListItemIcon className={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Home
          </ListItemText>
        </ListItem>

        <NavigatorGroupList />
        
        <Divider className={classes.divider} />

        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <ListItem
                key={childId}
                button
                className={clsx(classes.item, false && classes.itemActiveItem)}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}

        <ListItem className={classes.categoryHeader}>
          <ListItemText classes={{ primary: classes.categoryHeaderPrimary }}>You</ListItemText>
        </ListItem>

        <ListItem button className={clsx(classes.item)} onClick={() => alert('logout')}>
          <ListItemIcon className={classes.itemIcon}>
            <Lock />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.itemPrimary }}>
            Goodbye
          </ListItemText>
        </ListItem>

      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);
