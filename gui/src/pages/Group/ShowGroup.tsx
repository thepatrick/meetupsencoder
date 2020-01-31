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
import { SimpleHeader } from '../../components/SimpleHeader';
import { Group } from "../../model/Group";
import { RouteProps, RouteComponentProps } from "react-router-dom";

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

interface Props {
  loading: boolean;
  group?: Group,
  error?: Error;
}

const ShowGroupContentInner: FC<WithStylesProps & Props> = ({ group, loading, error }) => {
  if (loading) {
    return <div>Loading groups...</div>;
  }

  if (error) {
    return <div>Failed to load groups ${error.message}</div>;
  }

  if (!group) {
    return <React.Fragment>
    <SimpleHeader>Group not found</SimpleHeader>
  </React.Fragment>; 
  }
  
  return <React.Fragment>
    <SimpleHeader>{group.brand}</SimpleHeader>
    <MainContent>
      <h1>Hello</h1>
    </MainContent>
  </React.Fragment>;
};

const mapStateToProps = (state: RootState, ownProps: RouteComponentProps<{ groupId: string }>) => ({
  group: ownProps.match.params.groupId && state.groups.byId[ownProps.match.params.groupId] || undefined,
  loading: state.groupAdd.loading,
  error: state.groupAdd.error,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  groupAdd(token: string | undefined, brand: string) {
    dispatch(groupAdd(history, token, brand));
  }
});

export const ShowGroup = 
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(ShowGroupContentInner)
  );