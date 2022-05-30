import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
:root {
    --white:#fff;
    --dark-gray:#333;
    --main-gray:#ededed;
    --light-gray:#f7f7f7;
    --dark-green:#009688;
    --info-message:rgba(225,245,254,.92); /* blue messages */
}
    html {
       
    }
    
    * {
        margin: 0;
        padding: 0;
    }

    
`
export default GlobalStyle;