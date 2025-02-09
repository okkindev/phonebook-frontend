import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import styled from "styled-components";
import DashboardNavBar from "../components/DashboardNavBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  height: 100vh;
  padding-top: 80px;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 600px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfilePicture = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
  text-transform: uppercase;
`;

const WelcomeText = styled.h2`
  font-size: 22px;
  color: #333;
  margin-bottom: 5px;
`;

const RoleText = styled.p`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;

const EmailText = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const Loader = styled.div`
  font-size: 16px;
  color: #666;
`;

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${user.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Container>
      <DashboardNavBar />
      <ContentWrapper>
        {loading ? (
          <Loader>Loading your profile...</Loader>
        ) : (
          <>
            <ProfilePicture>
              {userData?.firstName.charAt(0)}
              {userData?.lastName.charAt(0)}
            </ProfilePicture>
            <WelcomeText>
              Welcome, {userData?.firstName} {userData?.lastName}!
            </WelcomeText>
            <RoleText>Role: {userData?.role}</RoleText>
            <EmailText>{userData?.email}</EmailText>
          </>
        )}
      </ContentWrapper>
    </Container>
  );
}

export default Dashboard;
