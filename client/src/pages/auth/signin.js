import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {styles} from "../../styles/styles";
import Link from "next/link";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign In to FBI list</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>
          Sign In
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p style={styles.signUpText}>
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" style={styles.signUpLink}>
          Sign Up
        </Link>
      </p>
    </div>
  );

  
}
