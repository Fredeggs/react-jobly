import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

function LoginForm({ login }) {
  const history = useHistory();
  const INITIAL_FORM_DATA = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    setFormData(INITIAL_FORM_DATA);
    history.push("/");
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
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default LoginForm;
