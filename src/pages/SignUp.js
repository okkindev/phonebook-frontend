import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, FormWrapper, Input, Button, ErrorMessage } from "../styles/FormStyles";

function SignUp() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/auth/signup", userData);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error signing up");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="First Name"
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>} {}
          {successMessage && (
            <ErrorMessage style={{ color: "green" }}>{successMessage}</ErrorMessage>
          )}
          <Button type="submit">Sign Up</Button>
        </form>
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </FormWrapper>
    </Container>
  );
}

export default SignUp;
