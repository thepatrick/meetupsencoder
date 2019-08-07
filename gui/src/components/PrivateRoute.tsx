import React, {FC, useEffect} from "react";
import {Route, RouteProps} from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

interface PrivateRouteProps {
    component: React.Component | FC;
}

export const PrivateRoute: FC<PrivateRouteProps & RouteProps> = ({ component: Component, path, ...rest }) => {
    const auth0Context =  useAuth0();

    const isAuthenticated = (auth0Context && auth0Context.isAuthenticated) || false;
    const loginWithRedirect = (auth0Context && auth0Context.loginWithRedirect) || function () {};

    useEffect(() => {
        const fn = async () => {
            if (auth0Context && !auth0Context.isAuthenticated) {
                try {
                    await auth0Context.getTokenSilently();
                } catch (e) {
                    await loginWithRedirect({
                        appState: { targetUrl: path }
                    });
                }
            }
        };
        fn();
    }, [auth0Context, isAuthenticated, loginWithRedirect, path]);

    const render = (props: any) => isAuthenticated ? <Component {...props} /> : null;

    return <Route path={path} render={render} {...rest} />;
};
