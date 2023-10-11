import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ChatBoard from "./ChatBoard";
import { AppContainer } from "./styles";
import GlobalStyle from "./css/globalStyle";
import { redirect, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setCurrentUser } from "./features/globalSlice";

function AppLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let checkUser = useRef<boolean>(false);

  useEffect(() => {
    const auth = getAuth();
    if (checkUser.current) return;
    const unsubscribeFromAuth = auth.onAuthStateChanged((authUser) => {
      if (authUser && !authUser.isAnonymous) dispatch(setCurrentUser(authUser));
      else {
        navigate("/login");
        checkUser.current = true;
      }
    });
    return () => {
      unsubscribeFromAuth();
    };
  });
  return (
    <AppContainer className="App">
      <GlobalStyle />
      <Outlet />
    </AppContainer>
  );
}
export default AppLayout;
