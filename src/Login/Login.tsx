import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { doLogin } from "../features/globalSlice";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const isLogin = useAppSelector((state) => state.global.isLogin);
  const hasError = useAppSelector((state) => state.global.hasError);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) return;
    navigate("/");
  }, [isLogin]);

  const login = (e: any) => {
    e.preventDefault();
    if (email?.trim().length == 0 || password?.trim().length == 0) {
      return false;
    }
    dispatch(doLogin({ email, password }));
    return false;
  };
  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      {hasError && (
        <p className="login-error">Please check you email or your password!</p>
      )}
      <form>
        <label>
          <p>Email</p>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit" onClick={login}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
