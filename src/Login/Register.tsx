import * as React from "react";
import { useState } from "react"; 


const Login = () => {
    const [username, setUserName] = useState<string>();
    const [password, setPassword] = useState<string>();  
            return(
              <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form>
                  <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                  </label>
                  <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                  </label>
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            )
          }
    
export default Login;