import React, { useState } from "react";
import JobList from "./JobList";
import JoblyApi from "./api";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function CompanyPage() {
  const [company, setCompany] = useState({});
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    async function getCompanyDetails() {
      const res = await JoblyApi.getCompany(id);
      console.log(res);
      setCompany(res);
    }
    getCompanyDetails();
  }, []);
  return (
    <div>
      <h1>{company.name}</h1>
      <JobList company={company.name} jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
