import { useState } from "react";
import API from "./services/api";

function Login({ setLoggedIn, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setLoggedIn(true);

      alert("Login Successful!");
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-page">

     <div className="login-card">

      <h1>Login🔐</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

      <p className="log-text">
       Don't have an account?
      </p>

      <button onClick={() => setShowRegister(true)}>
       Register
      </button>

     </div>
    </div>
  );
}

export default Login;