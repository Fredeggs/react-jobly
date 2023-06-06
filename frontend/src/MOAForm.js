import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";
import MOA from "./jpgs/test.jpg";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function MOAForm() {
  const history = useHistory();
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const handleChange = (e) => {
    console.log(e.target.files);
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await signup(formData);
    console.log(selectedFile);
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
      <Form>
        <FormGroup>
          <Label for="moa">Upload MOA</Label>
          <Input id="moa" name="moa" type="file" onChange={handleChange} />
          {isFilePicked ? (
            <div>
              <p>Filename: {selectedFile.name}</p>
              <p>Filetype: {selectedFile.type}</p>
              <p>Size in bytes: {selectedFile.size}</p>
              <p>
                lastModifiedDate:{" "}
                {selectedFile.lastModifiedDate.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>Select a file to show details</p>
          )}
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default MOAForm;
