import { useState } from "react";
import API from "./services/api";

function Register({setLoggedIn, setShowRegister}) {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleRegister=async()=>{

    try{

      const res=await API.post("/api/auth/register",{
        name,
        email,
        password
      });

      localStorage.setItem("token",res.data.token);
      setLoggedIn(true);
      alert("Registration Successful!");

    }catch(err){

      alert("Registration Failed");

    }

  };

  return (
  <div className="login-page">
    <div className="login-box">

      <h2>Create Account📝</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <button onClick={handleRegister}>
        Register
      </button>

      <p className="switch-text">
        Already have an account?
      </p>

      <button
        className="switch-btn"
        onClick={() => setShowRegister(false)}
      >
        Login
      </button>

    </div>
  </div>
);

}

export default Register;