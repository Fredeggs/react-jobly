import React, { useContext, useState, useEffect } from "react";
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import UserContext from "./userContext";

function ProfileForm({ updateUserDetails }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [alert, setAlert] = useState(false);
  const INITIAL_FORM_DATA = {
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: currentUser.password,
  };

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const { email, firstName, lastName, password } = formData;
    e.preventDefault();
    try {
      const updatedUser = await updateUserDetails({
        email,
        firstName,
        lastName,
        password,
      });
      setCurrentUser(updatedUser);
      setAlert(true);
    } catch (e) {}
  };

  return (
    <div>
      <h1>Log In</h1>
      <Form>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            disabled={true}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Save Changes</Button>
        {alert && <Alert color="primary">User Updated Successfully!</Alert>}
      </Form>
    </div>
  );
}

export default ProfileForm;
