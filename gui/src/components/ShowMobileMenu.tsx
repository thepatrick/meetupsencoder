import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import React, { FC } from "react";
import { connect } from "react-redux";
import { mobileOpen } from "../actions";
import { RootState } from "../reducers";

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
}), { name: 'ShowMobileMenu' });

interface Props {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const ShowMobileMenu: FC<Props> = (props) => {
  const classes = useStyles(props);
  
  const { mobileOpen, setMobileOpen } = props;
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
  };
  
  return <Hidden smUp>
      <Grid item>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Grid>
    </Hidden>;
};


const mapStateToProps = ({ mobileOpen } : RootState) => ({
  mobileOpen
});

function mapDispatchToProps(dispatch: Function) {
  return {
    setMobileOpen(open: boolean) {
      dispatch(mobileOpen(open));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowMobileMenu);