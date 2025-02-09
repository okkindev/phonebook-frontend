import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, FormWrapper, Input, Button, ErrorMessage } from "../styles/FormStyles";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/auth/forgot-password", { email });
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>} {}
          {successMessage && (
            <ErrorMessage style={{ color: "green" }}>{successMessage}</ErrorMessage>
          )}{" "}
          {}
          <Button type="submit">Send Reset Link</Button>
        </form>
      </FormWrapper>
    </Container>
  );
}

export default ForgotPassword;
