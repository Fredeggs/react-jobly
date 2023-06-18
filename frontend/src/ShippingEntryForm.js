import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";

function ShippingEntryForm({ getLibraries, createShipment }) {
  const history = useHistory();
  const INITIAL_FORM_DATA = {
    libraryId: "",
    exportDeclaration: "",
    invoiceNum: "",
    boxes: "",
    datePacked: "",
  };

  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const data = await getLibraries();
      const results = [];
      // Store results in the results array
      data.forEach((value) => {
        results.push({
          key: value.libraryName,
          value: value.id,
        });
      });
      // Update the options state
      setOptions([{ key: "Select a library", value: "" }, ...results]);
    }
    // Trigger the fetch
    fetchData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      exportDeclaration: parseInt(formData.exportDeclaration),
      invoiceNum: parseInt(formData.invoiceNum),
      libraryId: parseInt(formData.libraryId),
      boxes: parseInt(formData.boxes),
      datePacked: formData.datePacked,
    });
    await createShipment({
      exportDeclaration: parseInt(formData.exportDeclaration),
      invoiceNum: parseInt(formData.invoiceNum),
      libraryId: parseInt(formData.libraryId),
      boxes: parseInt(formData.boxes),
      datePacked: formData.datePacked,
    });
    setFormData(INITIAL_FORM_DATA);
    history.push("/");
  };
  return (
    <div>
      <h1>Shipping Entry</h1>
      <Form>
        <FormGroup>
          <Label for="library-id">School/Library</Label>
          <Input
            id="library-id"
            name="libraryId"
            type="select"
            value={formData.libraryId}
            onChange={handleChange}
          >
            {options.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              );
            })}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="export-declaration">Export Declaration Number</Label>
          <Input
            id="export-declaration"
            name="exportDeclaration"
            type="number"
            value={formData.exportDeclaration}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="invoice-num">Invoice Number</Label>
          <Input
            id="invoice-num"
            name="invoiceNum"
            type="number"
            value={formData.invoiceNum}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="boxes">Number of Boxes</Label>
          <Input
            id="boxes"
            name="boxes"
            type="number"
            value={formData.boxes}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="date-packed">Packing Date</Label>
          <Input
            id="date-packed"
            name="datePacked"
            type="date"
            value={formData.datePacked}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default ShippingEntryForm;
