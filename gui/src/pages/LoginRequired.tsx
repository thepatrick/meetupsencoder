import React, { FC } from "react";
import HomePageHeader from "../components/HomePageHeader";
import MainContent from "../components/MainContent";
import Content from "../paperbase/Content";
import { useAuth0 } from "../react-auth0-spa";

export const LoginRequired: FC = () => {
  const { loginWithRedirect } = useAuth0();
  return <React.Fragment>
    <HomePageHeader />
    <MainContent>
      <div>You need to be logged in!</div>
      <button onClick={() => loginWithRedirect({
          appState: { targetUrl: '/' },
          // scope: 'group:add video:create video:play',
        }) }>Log in</button>
    </MainContent>
  </React.Fragment>;
};

