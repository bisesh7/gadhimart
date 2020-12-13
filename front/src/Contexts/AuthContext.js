import React, { createContext, useReducer } from "react";
import { AuthReducer } from "../Reducers/AuthReducer";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [auth, dispatch] = useReducer(AuthReducer, {
    isAuthenticated: false,
    user: {},
  });

  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
