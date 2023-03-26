import React from "react";
import JobList from "./JobList";
import JoblyApi from "./api";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useState, useEffect } from "react";

function JobsPage() {
  const INITIAL_FORM_DATA = {
    search: "",
  };
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await JoblyApi.getJobs(formData.search);
    console.log(res);
    setJobs(res);
    setFormData(INITIAL_FORM_DATA);
  };

  useEffect(() => {
    async function searchJobs(searchTerm) {
      console.log(searchTerm);
      const res = await JoblyApi.getJobs(searchTerm);
      setJobs(res);
    }
    searchJobs(formData.search);
  }, []);

  return (
    <div>
      <h1>Jobs</h1>
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
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobsPage;
