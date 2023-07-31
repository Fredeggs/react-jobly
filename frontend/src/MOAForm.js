import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory, useNavigate } from "react-router-dom";
import UserContext from "./userContext";
import MOA from "./jpgs/MOA for new libraries rev2023.pdf";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function MOAForm({ createMOA, updateMOA, updateToken }) {
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
    const moaRes = await createMOA(currentUser.libraryId, form);
    await updateToken({
      ...currentUser,
      moaStatus: moaRes.moaStatus,
    });
    history.push("/");
  };

  if (
    currentUser.libraryId &&
    currentUser.moaStatus != "submitted" &&
    currentUser.moaStatus != "approved"
  ) {
    return (
      <div>
        <h1>Memorandum of Agreement Download and Submission</h1>
        <Link to={MOA} download="BKP_MOA" target="_blank" rel="noreferrer">
          <button>Download MOA pdf</button>
        </Link>
        {
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="moa">
                {" "}
                {currentUser.moaStatus === "rejected"
                  ? "Resubmit MOA"
                  : "Upload MOA"}
              </Label>
              <Input id="moa" name="moa" type="file" onChange={handleChange} />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        }
      </div>
    );
  }
  history.push("/");
}

export default MOAForm;
