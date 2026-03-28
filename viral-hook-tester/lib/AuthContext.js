import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  session: null,
  authLoading: true,
  authEnabled: false,
});

export const useAuth = () => useContext(AuthContext);
