import React, { useState, useContext, useEffect } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from "./userContext";
import LibraryCard from "./LibraryCard";
import ShipmentCard from "./ShipmentCard";

function Home({ getCurrentUser, getLibrary, getMOA }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [MOA, setMOA] = useState(null);
  const [currentShipments, setCurrentShipments] = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState({
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
    USContact: { firstName: "", lastName: "", email: "", phone: "" },
    PHContact: { firstName: "", lastName: "", email: "", phone: "" },
    admin: { id: "", firstName: "", lastName: "", email: "", phone: "" },
    readingSpaces: [],
    moa: { moaStatus: "" },
  });
  const history = useHistory();
  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const userData = await getCurrentUser();
      if (userData.libraryId) {
        const { library, shipments } = await getLibrary(userData.libraryId);
        setCurrentLibrary(library);
        setCurrentShipments(shipments);
      }
      setTimeout(async () => {
        if (userData.moaStatus) {
          const moaData = await getMOA(userData.libraryId);
          setMOA(moaData);
        }
      }, 1000);
    }
    // Trigger the fetch
    fetchData();
  }, []);
  return (
    <div>
      <h1>BKP Library Portal</h1>
      {currentUser && !currentUser.isAdmin ? (
        currentUser.libraryId ? (
          currentUser.moaStatus ? (
            <>
              {currentUser.moaStatus === "rejected" && (
                <>
                  <p>
                    Your latest submission of Memorandum of Agreement has been
                    rejected. Click below to resubmit!
                  </p>
                  <Button onClick={() => history.push("/moa-form")}>
                    Fill out Memorandum of Agreement
                  </Button>
                </>
              )}
              <h2>Your Library Information</h2>
              <LibraryCard
                adminFirstName={currentLibrary.admin.firstName}
                adminLastName={currentLibrary.admin.lastName}
                adminEmail={currentLibrary.admin.email}
                adminPhone={currentLibrary.admin.phone}
                USContactFirstName={currentLibrary.USContact.firstName}
                USContactLastName={currentLibrary.USContact.lastName}
                USContactEmail={currentLibrary.USContact.email}
                USContactPhone={currentLibrary.USContact.phone}
                PHContactFirstName={currentLibrary.PHContact.firstName}
                PHContactLastName={currentLibrary.PHContact.lastName}
                PHContactEmail={currentLibrary.PHContact.email}
                PHContactPhone={currentLibrary.PHContact.phone}
                libraryName={currentLibrary.libraryData.libraryName}
                moaStatus={currentLibrary.moa.moaStatus}
                libraryType={currentLibrary.libraryData.libraryType}
                readingProgram={currentLibrary.libraryData.readingProgram}
                primaryBarangay={currentLibrary.primaryAddress.barangay}
                primaryCity={currentLibrary.primaryAddress.city}
                primaryProvince={currentLibrary.primaryAddress.province}
                primaryRegion={currentLibrary.primaryAddress.region}
                primaryStreet={currentLibrary.primaryAddress.street}
                readingSpaces={currentLibrary.readingSpaces}
              />
              {(currentLibrary.moa.moaStatus === "submitted" ||
                currentLibrary.moa.moaStatus === "approved") && (
                <a href={MOA} target="_blank" download={true}>
                  <button>
                    View MOA for {currentLibrary.libraryData.libraryName}
                  </button>
                </a>
              )}

              <h2>Shipment Information</h2>

              {currentShipments.map((s) => (
                <ShipmentCard
                  exportDeclaration={s.exportDeclaration}
                  invoiceNum={s.invoiceNum}
                  boxes={s.boxes}
                  datePacked={s.datePacked}
                  receiptDate={s.receiptDate}
                />
              ))}
            </>
          ) : (
            <>
              <p>
                Thank you for registering your library! To start receiving
                books, please fill out a Memorandum of Agreement by clicking the
                button below
              </p>
              <Button onClick={() => history.push("/moa-form")}>
                Fill out Memorandum of Agreement
              </Button>
              <h2>Your Library Information</h2>
              <LibraryCard
                adminFirstName={currentLibrary.admin.firstName}
                adminLastName={currentLibrary.admin.lastName}
                adminEmail={currentLibrary.admin.email}
                adminPhone={currentLibrary.admin.phone}
                USContactFirstName={currentLibrary.USContact.firstName}
                USContactLastName={currentLibrary.USContact.lastName}
                USContactEmail={currentLibrary.USContact.email}
                USContactPhone={currentLibrary.USContact.phone}
                PHContactFirstName={currentLibrary.PHContact.firstName}
                PHContactLastName={currentLibrary.PHContact.lastName}
                PHContactEmail={currentLibrary.PHContact.email}
                PHContactPhone={currentLibrary.PHContact.phone}
                libraryName={currentLibrary.libraryData.libraryName}
                readingProgram={currentLibrary.libraryData.readingProgram}
                moaStatus={currentLibrary.moa.moaStatus}
                libraryType={currentLibrary.libraryData.libraryType}
                primaryBarangay={currentLibrary.primaryAddress.barangay}
                primaryCity={currentLibrary.primaryAddress.city}
                primaryProvince={currentLibrary.primaryAddress.province}
                primaryRegion={currentLibrary.primaryAddress.region}
                primaryStreet={currentLibrary.primaryAddress.street}
                readingSpaces={currentLibrary.readingSpaces}
              />
            </>
          )
        ) : (
          <>
            <p>
              Welcome! Trying to register a library? Click the button below!
            </p>
            <Button onClick={() => history.push("/library-form")}>
              Register Library
            </Button>
          </>
        )
      ) : currentUser && currentUser.isAdmin ? (
        <>
          <h2>Welcome to the admin dashboard!</h2>
          <h4>
            Use any of the links in the navbar above to perform admin duties
          </h4>
        </>
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
