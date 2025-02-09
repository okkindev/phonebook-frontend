import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DashboardNavBar from "../components/DashboardNavBar";
import { useAuth } from "../contexts/AuthContext";
import config from "../config";

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
  width: 98%;
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

const SharedToContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  white-space: nowrap;
`;

const SharedTag = styled.span`
  background: #e0e0e0;
  color: #333;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #d6d6d6;
  }
`;

const UnshareButton = styled.span`
  font-weight: bold;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
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

const PlusButton = styled.span`
  font-weight: bold;
  cursor: pointer;
  color: #28a745;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #1e7e34;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
`;

const PlaceholderImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #555;
`;

function MyContacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [creatingContact, setCreatingContact] = useState(false);
  const [viewingContact, setViewingContact] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });
  const [sharingContact, setSharingContact] = useState(null);
  const [searchUsers, setSearchUsers] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .get("/contacts")
      .then((response) => setContacts(response.data))
      .catch(() => {});
  }, []);

  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await api.delete(`/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    }
  };

  const handleCreateClick = () => {
    setFormData({ firstName: "", lastName: "", contactNumber: "", email: "" });
    setCreatingContact(true);
    setEditingContact(null);
    setViewingContact(false);
  };

  const handleEditClick = (contact) => {
    setFormData(contact);
    setEditingContact(contact);
    setCreatingContact(false);
    setViewingContact(false);
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();

      const fileData = JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        email: formData.email,
      });

      formDataToSend.append("fileData", fileData);
      if (file) {
        formDataToSend.append("file", file);
      }

      if (editingContact) {
        await api.put(`/contacts/${editingContact._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/contacts", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const response = await api.get("/contacts");
      setContacts(response.data);

      setCreatingContact(false);
      setEditingContact(null);
      setViewingContact(false);
      setFormData({ firstName: "", lastName: "", contactNumber: "", email: "" });
      setFile(null);
      setErrors({});
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleCancel = async () => {
    setCreatingContact(false);
    setEditingContact(null);
    setViewingContact(false);
    setSharingContact(null);
    setUsers([]);
    setSearchUsers("");
    setSelectedUsers([]);
  };

  const handleRowClick = async (contactId) => {
    try {
      const response = await api.get(`/contacts/${contactId}`);
      setFormData(response.data);
      setViewingContact(true);
      setCreatingContact(false);
      setEditingContact(false);
    } catch (error) {
      console.error("Error fetching contact details:", error);
    }
  };

  const handleShare = async (user) => {
    try {
      await api.post(`/contacts/share/${sharingContact._id}`, {
        users: [user._id],
      });

      setSharingContact((prev) => ({
        ...prev,
        sharedTo: Array.isArray(prev.sharedTo) ? [...prev.sharedTo, user] : [user],
      }));
    } catch (error) {
      console.error("Error sharing contact:", error);
    }
  };

  const handleUnshare = async (user) => {
    try {
      await api.post("/contacts/unshare", {
        userId: user._id,
        contactId: sharingContact._id,
      });

      setSharingContact((prev) => ({
        ...prev,
        sharedTo: prev.sharedTo ? prev.sharedTo.filter((u) => u._id !== user._id) : [],
      }));
    } catch (error) {
      console.error("Error unsharing contact:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (!/^\d{10,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid contact number (10-15 digits required)";
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
          <Link to="/dashboard">Dashboard</Link> &gt; My Contacts
          {creatingContact && " > Add Contact"}
          {editingContact && " > Edit Contact"}
          {sharingContact && " > Share Contact"}
        </Breadcrumb>

        <h2>My Contacts</h2>
        {viewingContact && (
          <ProfileContainer>
            {formData.profilePhoto ? (
              <ProfileImage
                src={`${config.BACKEND_BASE_URL}${formData.profilePhoto}`}
                alt="Profile"
              />
            ) : (
              <PlaceholderImage>No Image</PlaceholderImage>
            )}
          </ProfileContainer>
        )}
        {creatingContact || editingContact || viewingContact ? (
          <FormWrapper>
            <h3>{creatingContact ? "Add Contact" : viewingContact ? "" : "Edit Contact"}</h3>
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={viewingContact}
            />
            {errors.firstName && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</p>
            )}

            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={viewingContact}
            />
            {errors.lastName && <p style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</p>}

            <Input
              type="text"
              placeholder="Phone"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              disabled={viewingContact}
            />
            {errors.contactNumber && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.contactNumber}</p>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={viewingContact}
            />
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}

            {(creatingContact || editingContact) && (
              <>
                <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>
                  Profile Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    display: "block",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    marginBottom: "15px",
                  }}
                />
              </>
            )}

            <Button style={{ marginTop: "20px" }} onClick={handleCancel}>
              Close
            </Button>
            {!viewingContact && <Button onClick={handleFormSubmit}>Submit</Button>}
          </FormWrapper>
        ) : sharingContact ? (
          <FormWrapper>
            <h3>
              Share Contact: {sharingContact.firstName} {sharingContact.lastName}
            </h3>

            <SearchInput
              type="text"
              placeholder="Search users to share contact..."
              value={searchUsers}
              onChange={(e) => {
                setSearchUsers(e.target.value);
                if (e.target.value.length > 1) {
                  api
                    .get(`/users?search=${e.target.value}`)
                    .then((response) => setUsers(response.data))
                    .catch(() => setUsers([]));
                } else {
                  setUsers([]);
                }
              }}
            />

            <h4>Available Users</h4>
            <SharedToContainer>
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      background: "#f1f1f1",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onClick={() => handleShare(user)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e0e0")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f1f1")}
                  >
                    {user.firstName} {user.lastName}
                    <PlusButton title="Share Contact">+</PlusButton>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "14px", color: "#888" }}>No results for users found.</p>
              )}
            </SharedToContainer>

            <h4>Currently Shared Contacts</h4>
            <SharedToContainer>
              {sharingContact.sharedTo && sharingContact.sharedTo.length > 0 ? (
                sharingContact.sharedTo.map((user) => (
                  <SharedTag key={user._id}>
                    {user.firstName} {user.lastName}
                    <UnshareButton onClick={() => handleUnshare(user)}>×</UnshareButton>
                  </SharedTag>
                ))
              ) : (
                <p style={{ fontSize: "14px", color: "#888" }}>No shared contacts.</p>
              )}
            </SharedToContainer>

            <Button
              style={{ marginTop: "20px" }}
              onClick={() => {
                setSharingContact(null);
                setUsers([]);
                setSearchUsers("");
              }}
            >
              Close
            </Button>
          </FormWrapper>
        ) : (
          <>
            <TopBar>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <SearchInput
                  type="text"
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearch(query);

                    if (query === "") {
                      fetchContacts();
                    } else {
                      const filteredContacts = contacts.filter(
                        (contact) =>
                          contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
                          contact.lastName.toLowerCase().includes(query.toLowerCase())
                      );
                      setContacts(filteredContacts);
                    }
                  }}
                />
                <SyncButton onClick={fetchContacts} title="Refresh Contacts" />
              </div>

              <CreateButton onClick={handleCreateClick}>+ Add Contact</CreateButton>
            </TopBar>
            <Table>
              <thead>
                <tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Contact Number</Th>
                  <Th>Email</Th>
                  <Th>Type</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    onClick={() => handleRowClick(contact._id)}
                    style={{
                      cursor: "pointer",
                      transition: "background 0.2s ease-in-out",
                      borderRadius: "6px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dbeafe")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Td>{contact.firstName}</Td>
                    <Td>{contact.lastName}</Td>
                    <Td>{contact.contactNumber}</Td>
                    <Td>{contact.email}</Td>
                    <Td>{contact.owner === user.id ? <span>Owned</span> : <span>Shared</span>}</Td>
                    <Td>
                      {contact.owner === user.id && (
                        <>
                          <Button
                            style={{ background: "#17a2b8" }}
                            onClick={async (e) => {
                              e.stopPropagation();

                              try {
                                const response = await api.get(`/contacts/${contact._id}`);
                                setSharingContact(response.data);
                              } catch (error) {
                                console.error("Error fetching shared contacts:", error);
                                setSharingContact(contact);
                              }

                              setSearchUsers("");
                              setUsers([]);
                            }}
                          >
                            Share
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(contact);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            danger
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact._id);
                            }}
                          >
                            Delete
                          </Button>
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

export default MyContacts;
