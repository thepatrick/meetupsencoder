import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  iconButtonAvatar: {
    padding: 4,
  },
}), { name: 'CurrentAvatar' });

const CurrentAvatar: FunctionComponent = (props) => {
  const classes = useStyles(props);
  
  return <Grid item>
    <IconButton color="inherit" className={classes.iconButtonAvatar}>
      <Avatar
        src="/static/images/avatar/1.jpg"
        alt="My Avatar"
      />
    </IconButton>
  </Grid>;
};

export default CurrentAvatar;