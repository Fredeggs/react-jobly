import React, { useState, useEffect } from "react";
import CompanyList from "./CompanyList";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import BKPApi from "./api";

function CompaniesPage() {
  const INITIAL_FORM_DATA = {
    search: "",
  };
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await BKPApi.getCompanies(formData.search);
    setCompanies(res);
    setFormData(INITIAL_FORM_DATA);
  };

  useEffect(() => {
    async function searchCompanies(searchTerm) {
      const res = await BKPApi.getCompanies(searchTerm);
      setCompanies(res);
    }
    searchCompanies(formData.search);
  }, []);

  return (
    <div>
      <h1>Companies</h1>
      <Form>
        <FormGroup>
          <Label for="search"></Label>
          <Input
            id="search"
            name="search"
            placeholder="Enter search term"
            type="text"
            value={formData.search}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
      <CompanyList companies={companies} />
    </div>
  );
}

export default CompaniesPage;
