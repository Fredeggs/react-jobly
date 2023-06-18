import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import UserContext from "./userContext";
import LibraryCard from "./LibraryCard";
import BKPApi from "./api";

function NewApplications({ getLibraries }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      const res = await getLibraries({ submittedMOA: true });
      setLibraries(res);
    }

    // Trigger the fetch
    fetchData();
  }, [currentUser]);

  return (
    <div>
      <h1>New Library Applications</h1>
      <div>
        <p>
          {libraries.map((l) => (
            <Link
              key={l.id}
              exact={"true"}
              to={`/libraries/${l.id}`}
              className="navbar-brand"
            >
              <li>{l.libraryName}</li>
            </Link>
          ))}
        </p>
      </div>
    </div>
  );
}

export default NewApplications;
