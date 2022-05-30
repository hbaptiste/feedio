import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ChatBoard from "./ChatBoard";
import { AppContainer } from "./styles";
import GlobalStyle from "./css/globalStyle";

function App() {
  return (
    <div className="App">
      <AppContainer>
        <GlobalStyle />
        <ChatBoard lastMessage="" messages={[]} />
      </AppContainer>
    </div>
  );
}
export default App;
