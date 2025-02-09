import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, FormWrapper, Input, Button, ErrorMessage } from "../styles/FormStyles";
import styled from "styled-components";

const BrandContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const BrandTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
`;

const Tagline = styled.p`
  font-size: 16px;
  color: #6c757d;
`;

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/auth/signin", { email, password });
      localStorage.setItem("token", response.data.accessToken);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <BrandContainer>
          <BrandTitle>PhoneBook</BrandTitle>
          <Tagline>Your Smart Contact Manager.</Tagline>
        </BrandContainer>

        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Sign In</Button>
        </form>

        <p>
          No account? <Link to="/signup">Sign Up</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </FormWrapper>
    </Container>
  );
}

export default SignIn;
