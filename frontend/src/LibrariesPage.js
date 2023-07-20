import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import UserContext from "./userContext";
import LibraryCard from "./LibraryCard";
import BKPApi from "./api";

function LibrariesPage({ getLibraries }) {
  const INITIAL_FORM_DATA = {
    search: "",
  };

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [libraries, setLibraries] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await BKPApi.getLibraries({ libraryName: formData.search });
    setLibraries(res);
    setFormData(INITIAL_FORM_DATA);
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const res = await getLibraries();
      setLibraries(res);
    }

    // Trigger the fetch
    fetchData();
  }, [currentUser]);

  return (
    <div>
      <h1>Library Database</h1>
      <Form onSubmit={handleSubmit}>
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
        <FormGroup>
          <Label for="can-ship">Filter For Shipment Eligibility</Label>
          <Input
            id="can-ship"
            name="canShip"
            type="checkbox"
            defaultChecked={false}
          />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
      <div>
        <ul>
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
        </ul>
      </div>
    </div>
  );
}

export default LibrariesPage;
