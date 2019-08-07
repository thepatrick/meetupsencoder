import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import PublicIcon from '@material-ui/icons/Public';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from "clsx";
import React, { FC, useEffect } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { groupsLoad } from "../actions";
import { history } from "../configureStore";
import { Group } from "../model/Group";
import { RootState } from "../reducers";

const useStyles = makeStyles((theme: Theme) => ({
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
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    fontSize: 'inherit',
  },
}), { name: 'NavigatorGroupList' });

interface Props {
  loading: boolean;
  groups: { [key: number]: Group };
  error?: Error;
  groupsLoad: Function,
}

const NavigatorGroupList: FC<Props> = (props) => {
  const classes = useStyles(props);

  const { loading, groups, error, groupsLoad } = props;

  useEffect(() => {
    console.log('hi');
    groupsLoad();
  }, []);

  return (
    <React.Fragment>
      <ListItem className={classes.categoryHeader}>
        <ListItemText
          classes={{
            primary: classes.categoryHeaderPrimary,
          }}
        >
          Groups
        </ListItemText>
      </ListItem>
      {loading && <ListItem className={clsx(classes.item)}>
        <ListItemIcon className={classes.itemIcon}><HourglassEmpty /></ListItemIcon>
        <ListItemText classes={{ primary: classes.itemPrimary }}>Loading...</ListItemText>
      </ListItem>}
      {error && <ListItem className={clsx(classes.item)}>
        <ListItemIcon className={classes.itemIcon}><WarningIcon /></ListItemIcon>
        <ListItemText classes={{ primary: classes.itemPrimary }}>:( {error.message}</ListItemText>
      </ListItem>}
      {!loading && Object.entries(groups).map(([childId, { brand }]) => (
        <ListItem
          key={childId}
          button
          className={clsx(classes.item, false && classes.itemActiveItem)}
          onClick={() => history.push(`/group/${childId}`)}
        >
          <ListItemIcon className={classes.itemIcon}><PublicIcon /></ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            {brand}
          </ListItemText>
        </ListItem>
      ))}
      <ListItem
        button
        className={clsx(classes.item, false && classes.itemActiveItem)}
      >
        <ListItemIcon className={classes.itemIcon}><AddIcon /></ListItemIcon>
        <ListItemText
          classes={{
            primary: classes.itemPrimary,
          }}
          onClick={() => history.push(`/group/new`)}
        >
          Add...
        </ListItemText>
      </ListItem>
    </React.Fragment>
  )
};

const mapStateToProps = (state: RootState) => ({
  loading: state.groups.loading,
  groups: state.groups.byId,
  error: state.groups.error,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  groupsLoad() {
    dispatch(groupsLoad());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorGroupList);