import React, { useState } from "react";
import { auth } from "../server/firebaseAdmin";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdToken,
} from "firebase/auth";
import axios from "axios";
import { Input } from "./components/ui/Input";
import { Button } from "./components/ui/Button";

const Login = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const token = await getIdToken(userCredential.user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      onAuth(userCredential.user);
    } catch (error) {
      console.error("Authentication Error:", error.message);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={"border p-2 w-full"}
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={"border p-2 w-full"}
        />
    
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full mt-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 mt-4 w-full"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 underline">
        {isSignUp
          ? "Already have an account? Login"
          : "Need an account? Sign Up"}
      </button>
    </div>
  );
};

export default Login;
