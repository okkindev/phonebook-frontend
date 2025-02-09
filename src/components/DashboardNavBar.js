import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #007bff;
  padding: 15px 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled.h2`
  color: white;
  font-weight: bold;
  font-size: 24px;
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #f8f9fa;
  }
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease;
  margin-right: 50px;

  &:hover {
    background: #c82333;
  }
`;

function DashboardNavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <NavBar>
      <Logo>PhoneBook</Logo>
      <NavLinks>
        <Link to="/dashboard">Home</Link>
        {["admin", "super-admin"].includes(user.role) && <Link to="/users">User Management</Link>}
        <Link to="/contacts">My Contacts</Link>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavLinks>
    </NavBar>
  );
}

export default DashboardNavBar;
