import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DashboardNavBar from "../components/DashboardNavBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  height: 100vh;
  padding-top: 80px;
`;
const ContentWrapper = styled.div`
  width: 90%;
  max-width: 900px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  margin-top: 20px;
`;

const Breadcrumb = styled.div`
  text-align: left;
  font-size: 14px;
  margin-bottom: 15px;

  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const CreateButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: #218838;
  }
`;

const FormWrapper = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 97%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: left;
`;

const Th = styled.th`
  background: #007bff;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

const Button = styled.button`
  background: ${(props) => (props.danger ? "#dc3545" : "#28a745")};
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s ease;
  margin-right: 5px;

  &:hover {
    background: ${(props) => (props.danger ? "#c82333" : "#218838")};
  }
`;

const SyncButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #6c757d;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #343a40;
    transform: rotate(180deg);
  }

  &:before {
    content: "↻";
    font-size: 20px;
  }
`;

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    }
  };

  const handleCreateClick = () => {
    setFormData({ firstName: "", lastName: "", email: "" });
    setCreatingUser(true);
    setEditingUser(null);
  };

  const handleEditClick = (user) => {
    setFormData(user);
    setEditingUser(user);
    setCreatingUser(false);
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (creatingUser) {
        await api.post("/users", formData);
      } else {
        await api.put(`/users/${formData._id}`, formData);
      }

      const response = await api.get("/users");
      setUsers(response.data);

      setCreatingUser(false);
      setEditingUser(null);
      setFormData({ firstName: "", lastName: "", email: "" });
      setErrors({});
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleCancel = async () => {
    setCreatingUser(false);
    setEditingUser(null);

    const response = await api.get("/users");
    setUsers(response.data);
  };

  const handleUserStatusChange = async (id, action) => {
    try {
      const endpoint = action === "approve" ? `/users/approve/${id}` : `/users/deactivate/${id}`;
      await api.put(endpoint);

      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container>
      <DashboardNavBar />

      <ContentWrapper>
        <Breadcrumb>
          <Link to="/dashboard">Dashboard</Link> &gt; User Management{" "}
          {creatingUser && "> Create User"} {editingUser && "> Edit User"}
        </Breadcrumb>

        <h2>User Management</h2>

        {creatingUser || editingUser ? (
          <FormWrapper>
            <h3>{creatingUser ? "Create User" : "Edit User"}</h3>
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</p>
            )}

            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <p style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</p>}

            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </FormWrapper>
        ) : (
          <>
            <TopBar>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <SearchInput
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <SyncButton onClick={fetchUsers} title="Refresh Users" />
              </div>

              <CreateButton onClick={handleCreateClick}>+ Create User</CreateButton>
            </TopBar>
            <Table>
              <thead>
                <tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) =>
                    `${u.firstName} ${u.lastName} ${u.email}`
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((u) => (
                    <tr key={u._id}>
                      <Td>{u.firstName}</Td>
                      <Td>{u.lastName}</Td>
                      <Td>{u.email}</Td>
                      <Td>{u.role}</Td>
                      <Td>{u.status}</Td>
                      <Td style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Button onClick={() => handleEditClick(u)}>Edit</Button>
                        {u.email === user.email ? (
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "14px",
                              color: "#555",
                              background: "#e0e0e0",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              minWidth: "50px",
                              textAlign: "center",
                            }}
                          >
                            You
                          </span>
                        ) : (
                          <>
                            <Button danger onClick={() => handleDelete(u._id)}>
                              Delete
                            </Button>

                            {u.status === "pending" && (
                              <>
                                <Button onClick={() => handleUserStatusChange(u._id, "approve")}>
                                  Approve
                                </Button>
                                <Button
                                  style={{ background: "#ffc107" }}
                                  onClick={() => handleUserStatusChange(u._id, "deactivate")}
                                >
                                  Deactivate
                                </Button>
                              </>
                            )}

                            {u.status === "approved" && (
                              <Button
                                style={{ background: "#ffc107" }}
                                onClick={() => handleUserStatusChange(u._id, "deactivate")}
                              >
                                Deactivate
                              </Button>
                            )}
                          </>
                        )}
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        )}
      </ContentWrapper>
    </Container>
  );
}

export default UserManagement;
