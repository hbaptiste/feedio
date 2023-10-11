import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
:root { 
    --white:#fff;
    --dark-gray:#333;
    --main-gray:#ededed;
    --light-gray:#f7f7f7;
    --dark-green:#009688;
    --info-message:rgba(225,245,254,.92); /* blue messages */
    --font-size-1: 14px;
    }
    html, body {
        height: 100%;
        height: 100vh;
        margin: 0;
    }
    #root {
        min-height: 100vh;
        height: 100%;
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .ico-btn {
        width: 25px;
        height: 25px;
        background: #ededed;
        border-radius : 50%;
        margin-right: 10px;
        padding: 3px;
        cursor: pointer;
    }
    .ico-btn:hover {
        background: #D3DEDC;
    }
    
`
export default GlobalStyle;