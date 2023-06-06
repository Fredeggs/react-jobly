import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
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
      <p>This is the new applications page!</p>
      <div>
        <p>
          {libraries.map((l) => (
            <LibraryCard
              libraryName={l.libraryName}
              moaStatus={l.moaStatus}
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

export default NewApplications;
