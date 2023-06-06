import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
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
      <p>This is the libraries database page!</p>
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
      <div>
        <p>
          {libraries.map((l) => (
            <LibraryCard
              libraryName={l.libraryName}
              libraryType={l.libraryType}
              primaryBarangay={l.primaryBarangay}
              primaryCity={l.primaryCity}
              primaryProvince={l.primaryProvince}
              primaryRegion={l.primaryRegion}
              primaryStreet={l.primaryStreet}
              shippingBarangay={l.shippingBarangay}
              shippingCity={l.shippingCity}
              shippingProvince={l.shippingProvince}
              shippingRegion={l.shippingRegion}
              shippingStreet={l.shippingStreet}
            />
          ))}
        </p>
      </div>
    </div>
  );
}

export default LibrariesPage;
