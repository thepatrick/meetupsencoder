import React, { FC } from "react";
import HomePageHeader from "../components/HomePageHeader";
import MainContent from "../components/MainContent";
import Content from "../paperbase/Content";
import {useAuth0} from "../react-auth0-wrapper";

const Profile: FC = () => {
  const auth0Context = useAuth0();
  if (auth0Context == null || auth0Context.loading || auth0Context.user == null) {
    return <div>Loading...</div>;
  }

  const user = auth0Context.user as { picture: string, name: string, email: string };

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );

};

const HomePage: FC = () => {
  return <React.Fragment>
    <HomePageHeader />
    <MainContent>
      <Profile />
      <Content />
    </MainContent>
  </React.Fragment>;
};


export default HomePage;
