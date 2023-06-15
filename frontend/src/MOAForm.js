import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";
import MOA from "./jpgs/test.jpg";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function MOAForm({ createMOA }) {
  const history = useHistory();
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const handleChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("moa", selectedFile);
    await createMOA(currentUser.libraryId, form);
    history.push("/");
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
    }

    // Trigger the fetch
    fetchData();
  }, []);
  return (
    <div>
      <h1>Memorandum of Agreement Download and Submission</h1>
      <Link to={MOA} download="test" target="_blank" rel="noreferrer">
        <button>Download MOA pdf</button>
      </Link>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="moa">Upload MOA</Label>
          <Input id="moa" name="moa" type="file" onChange={handleChange} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

export default MOAForm;
