import React from "react";
import CompanyCard from "./CompanyCard";
import { Link } from "react-router-dom";

function CompanyList({ companies }) {
  return (
    <div>
      {companies &&
        companies.map((c) => (
          <div key={c.handle}>
            <Link exact={"true"} to={`/companies/${c.handle}`}>
              <CompanyCard
                name={c.name}
                description={c.description}
                jobs={c.jobs}
              />
            </Link>
          </div>
        ))}
    </div>
  );
}

export default CompanyList;
