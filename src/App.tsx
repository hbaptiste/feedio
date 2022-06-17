import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ChatBoard from "./ChatBoard";
import { AppContainer } from "./styles";
import GlobalStyle from "./css/globalStyle";
import { getAuth, signInAnonymously } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      setIsLoggedIn(true);
    })
    .catch((error) => console.log);

  return (
    <div className="App">
      <AppContainer>
        <GlobalStyle />
        {!isLoggedIn ? (
          <p>Loading</p>
        ) : (
          <ChatBoard lastMessage="" messages={[]} />
        )}
      </AppContainer>
    </div>
  );
}
export default App;
