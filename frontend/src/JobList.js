import React from "react";
import JobCard from "./JobCard";

function JobList({ jobs, company }) {
  return (
    <div>
      {jobs &&
        jobs.map((j) => (
          <JobCard
            key={j.id}
            title={j.title}
            salary={j.salary}
            equity={j.equity}
            company={company || j.companyName}
          />
        ))}
    </div>
  );
}

export default JobList;
