import React, { useState, useEffect, useContext, FC } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

interface Auth0ProviderProps {
  onRedirectCallback: (appState?: { targetUrl: string }) => void;
}

interface Auth0ContextInterface {
  isAuthenticated: boolean | undefined,
  user: unknown,
  loading: boolean,
  popupOpen: boolean,
  loginWithPopup: (params?: PopupLoginOptions) => Promise<void>,
  handleRedirectCallback: () => Promise<void>,
  getIdTokenClaims: (options?: getIdTokenClaimsOptions) => Promise<IdToken | undefined>,
  loginWithRedirect: Auth0Client['loginWithRedirect'],
  getTokenSilently: Auth0Client['getTokenSilently'],
  getTokenWithPopup: (options?: GetTokenWithPopupOptions) => Promise<string | undefined>,
  logout: Auth0Client['logout'],
}

export const Auth0Context = React.createContext<Auth0ContextInterface | undefined>(undefined);
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider: FC<Auth0ProviderProps & Auth0ClientOptions> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params: PopupLoginOptions = {}): Promise<void> => {
    if (auth0Client == null) {
      throw new Error('auth0Client is undefined');
    }
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async (): Promise<void> => {
    if (auth0Client == null) {
      throw new Error('auth0Client is undefined');
    }
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const contextValue: Auth0ContextInterface = {
    isAuthenticated,
    user,
    loading,
    popupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getIdTokenClaims: async (options?: getIdTokenClaimsOptions) => auth0Client && await auth0Client.getIdTokenClaims(options),
    loginWithRedirect: async (options?: RedirectLoginOptions) => auth0Client && await auth0Client.loginWithRedirect(options),
    getTokenSilently: async (options?: GetTokenSilentlyOptions) => auth0Client && await auth0Client.getTokenSilently(options),
    getTokenWithPopup: async (options?: GetTokenWithPopupOptions) => auth0Client && await auth0Client.getTokenWithPopup(options),
    logout: (options?: LogoutOptions) => auth0Client && auth0Client.logout(options),
  };

  return (
    <Auth0Context.Provider
      value={contextValue}
    >
      {children}
    </Auth0Context.Provider>
  );
};
