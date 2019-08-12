import React, { FC } from "react";
import MainContent from "../../components/MainContent";
import { useAuth0 } from "../../react-auth0-spa";
import Paper from "@material-ui/core/Paper";
import { Theme, withStyles } from "@material-ui/core/styles";
import { WithStylesProps } from '../../WithStylesProps';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { reduxForm, InjectedFormProps, Field } from "redux-form";
import { renderTextField } from "../../components/MaterialUIForm";
import { RootState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import { groupAdd } from "../../actions";
import { connect } from "react-redux";
import { history } from "../../configureStore";

const styles = (theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
});

const validate = (values: { [key: string]: string }) => {
  const errors: { [key: string]: string } = {};
  const requiredFields = [
    'brand'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
}

const NewGroupForm: FC<WithStylesProps & InjectedFormProps> = ({ classes, handleSubmit, pristine, submitting, reset }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Field
            name="brand"
            component={renderTextField}
            label="Name"
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          disabled={pristine || submitting}
          onClick={reset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
          disabled={pristine || submitting}
        >
          Create Group
        </Button>
      </div>
    </form>
  );
};

const NewGroupReduxForm = reduxForm({
  form: 'NewGroupForm',
  validate,
})(withStyles(styles)(NewGroupForm));

interface Props {
  // loading: boolean;
  // groups: { [key: number]: Group };
  error?: Error;
  groupAdd: Function,
}

const NewGroupContentInner: FC<WithStylesProps & Props> = ({
  classes,
  groupAdd,
}) => {
  const { loading, isAuthenticated, getTokenSilently } = useAuth0();
  if (loading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {/* <SimpleHeader>Create New Group</SimpleHeader> */}
      <MainContent>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Create new group
          </Typography>

          <NewGroupReduxForm onSubmit={async ({ brand }) => groupAdd(await getTokenSilently(), brand)} />

          {/* <Typography variant="h6" gutterBottom>
            Shipping address
          </Typography> */}
        </Paper>
      </MainContent>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.groupAdd.loading,
  error: state.groupAdd.error,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  groupAdd(token: string | undefined, brand: string) {
    dispatch(groupAdd(history, token, brand));
  }
});

export const NewGroup = 
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(NewGroupContentInner)
  );


// export default connect(mapStateToProps, mapDispatchToProps)(NavigatorGroupList);