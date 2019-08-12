import React, { FC, useState } from "react";
import HomePageHeader from "../components/HomePageHeader";
import MainContent from "../components/MainContent";
import Content from "../paperbase/Content";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");


  const auth0Context = useAuth0();
  if (auth0Context == null || auth0Context.loading || auth0Context.user == null) {
    return <div>Loading...</div>;
  }

  const { getTokenSilently } = auth0Context;

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      console.log(`Bearer ${token}`);

      const response = await fetch("/api/v1/group", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </div>
  );
};

const Profile: FC = () => {
  const { loading, user } = useAuth0();
  if (loading || user == null) {
    return <div>Loading...</div>;
  }

  const realUser = user as { picture: string, name: string, email: string };

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
      <ExternalApi />
      <Profile />
      <Content />
    </MainContent>
  </React.Fragment>;
};


export default HomePage;
