import React, { useState, useContext, useEffect } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from "./userContext";
import LibraryCard from "./LibraryCard";

function Home({ getCurrentUser, getLibrary }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [library, setLibrary] = useState({
    libraryData: {
      libraryName: "",
      libraryType: "",
      program: "",
      classrooms: "",
      teachers: "",
      studentsPerGrade: "",
    },
    primaryAddress: {
      street: "",
      barangay: "",
      city: "",
      provinceId: "",
      regionId: "",
    },
    shippingAddress: {
      street: "",
      barangay: "",
      city: "",
      provinceId: "",
      regionId: "",
    },
    contactData: { firstName: "", lastName: "", email: "", phone: "" },
    adminId: "",
    moa: { moaStatus: "" },
  });
  const history = useHistory();
  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const userData = await getCurrentUser();
      const libraryData = await getLibrary(userData.libraryId);
      setLibrary(libraryData);
    }
    // Trigger the fetch
    fetchData();
  }, []);
  return (
    <div>
      <h1>BKP Library Portal</h1>
      {currentUser ? (
        currentUser.libraryId ? (
          currentUser.moaStatus ? (
            <>
              <p>I have an moaStatus of: {currentUser.moaStatus}</p>
              <LibraryCard
                libraryName={library.libraryData.libraryName}
                moaStatus={library.moa.moaStatus}
                libraryType={library.libraryData.libraryType}
                primaryBarangay={library.primaryAddress.barangay}
                primaryCity={library.primaryAddress.city}
                primaryProvince={library.primaryAddress.province}
                primaryRegion={library.primaryAddress.region}
                primaryStreet={library.primaryAddress.street}
                shippingBarangay={library.shippingAddress.barangay}
                shippingCity={library.shippingAddress.city}
                shippingProvince={library.shippingAddress.province}
                shippingRegion={library.shippingAddress.region}
                shippingStreet={library.shippingAddress.street}
              />
            </>
          ) : (
            <>
              <p>
                Thank you for registering your library! In order to start
                receiving books, you will need to fill out a Memorandum of
                Agreement
              </p>
              <Button onClick={() => history.push("/moa-form")}>
                Fill out Memorandum of Agreement
              </Button>
              <LibraryCard
                libraryName={library.libraryData.libraryName}
                moaStatus={library.libraryData.moaStatus}
                libraryType={library.libraryData.libraryType}
                primaryBarangay={library.primaryAddress.barangay}
                primaryCity={library.primaryAddress.city}
                primaryProvince={library.primaryAddress.province}
                primaryRegion={library.primaryAddress.region}
                primaryStreet={library.primaryAddress.street}
                shippingBarangay={library.shippingAddress.barangay}
                shippingCity={library.shippingAddress.city}
                shippingProvince={library.shippingAddress.province}
                shippingRegion={library.shippingAddress.region}
                shippingStreet={library.shippingAddress.street}
              />
            </>
          )
        ) : (
          <>
            <p>Welcome! Trying to register a library? Click Below</p>
            <Button onClick={() => history.push("/library-form")}>
              Register Library
            </Button>
          </>
        )
      ) : (
        <>
          <h2>Manage Your Library Here</h2>
          <h4>Please sign up or log in to get started 😁</h4>
        </>
      )}
    </div>
  );
}

export default Home;
