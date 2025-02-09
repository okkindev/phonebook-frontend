import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, FormWrapper, Input, Button, ErrorMessage } from "../styles/FormStyles";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <Input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {successMessage && (
            <ErrorMessage style={{ color: "green" }}>{successMessage}</ErrorMessage>
          )}
          <Button type="submit">Reset Password</Button>
        </form>
      </FormWrapper>
    </Container>
  );
}

export default ResetPassword;
