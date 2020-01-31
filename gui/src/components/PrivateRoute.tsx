import React, { useEffect, FC } from "react";
import PropTypes from "prop-types";
import { Route, RouteProps } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

export const PrivateRoute: FC<RouteProps> = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: path },
          // scope: 'group:add video:create video:play',
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);


  // @ts-ignore
  const render = (props: any) => isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};
