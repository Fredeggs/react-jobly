import React, { useContext, useState, useEffect } from "react";
import { Form, FormGroup, Input, Label, Button, Alert } from "reactstrap";
import UserContext from "./userContext";

function ProfileForm({ updateUserDetails }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [alert, setAlert] = useState(false);
  const INITIAL_FORM_DATA = {
    phone: currentUser.phone,
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
    const { email, firstName, lastName, password, phone } = formData;
    e.preventDefault();
    try {
      const updatedUser = await updateUserDetails({
        email,
        firstName,
        lastName,
        password,
        phone,
      });
      setCurrentUser(updatedUser);
      setAlert(true);
    } catch (e) {}
  };

  return (
    <div>
      <h1>Make changes to your profile</h1>
      <Form onSubmit={handleSubmit}>
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
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
        </FormGroup>
        <Button>Save Changes</Button>
        {alert && <Alert color="primary">User Updated Successfully!</Alert>}
      </Form>
    </div>
  );
}

export default ProfileForm;
