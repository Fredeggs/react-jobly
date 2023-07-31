import React, { useState, useEffect, useContext } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory, useParams, Link } from "react-router-dom";
import UserContext from "./userContext";
import LibraryCard from "./LibraryCard";
import ShipmentCard from "./ShipmentCard";
import BKPApi from "./api";

function LibraryPage({ getLibrary, getMOA, updateMOA }) {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [currentLibrary, setCurrentLibrary] = useState(null);
  const [currentShipments, setCurrentShipments] = useState([]);
  const [MOA, setMOA] = useState(null);
  const { id } = useParams();

  const handleApprove = async () => {
    await updateMOA(currentLibrary.id, { moaStatus: "approved" });
    history.push("/new-applications");
  };

  const handleReject = async () => {
    await updateMOA(currentLibrary.id, { moaStatus: "rejected" });
    history.push("/new-applications");
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const { library, shipments } = await getLibrary(id);
      setCurrentLibrary(library);
      setCurrentShipments(shipments);
      if (
        library.moa.moaStatus === "submitted" ||
        library.moa.moaStatus === "approved"
      ) {
        const moaRes = await getMOA(id);
        setMOA(moaRes);
      }
    }

    // Trigger the fetch
    fetchData();
  }, [currentUser]);

  return (
    <>
      {currentLibrary && (
        <div key={currentLibrary.id}>
          <h2>
            Library Information for {currentLibrary.libraryData.libraryName}
          </h2>
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
            readingProgram={currentLibrary.libraryData.program}
            moaStatus={currentLibrary.moa.moaStatus}
            libraryType={currentLibrary.libraryData.libraryType}
            primaryBarangay={currentLibrary.primaryAddress.barangay}
            primaryCity={currentLibrary.primaryAddress.city}
            primaryProvince={currentLibrary.primaryAddress.province}
            primaryRegion={currentLibrary.primaryAddress.region}
            primaryStreet={currentLibrary.primaryAddress.street}
            readingSpaces={currentLibrary.readingSpaces}
            teachers={currentLibrary.libraryData.teachers}
            studentsPerGrade={currentLibrary.libraryData.studentsPerGrade}
            classrooms={currentLibrary.libraryData.classrooms}
            totalResidents={currentLibrary.libraryData.totalResidents}
            elementaryVisitors={currentLibrary.libraryData.elementaryVisitors}
            highSchoolVisitors={currentLibrary.libraryData.highSchoolVisitors}
            collegeVisitors={currentLibrary.libraryData.collegeVisitors}
            adultVisitors={currentLibrary.libraryData.adultVisitors}
          />
          {(currentLibrary.moa.moaStatus === "submitted" ||
            currentLibrary.moa.moaStatus === "approved") && (
            <a href={MOA} target="_blank" download={true}>
              <button>
                View MOA for {currentLibrary.libraryData.libraryName}
              </button>
            </a>
          )}
          {currentLibrary.moa.moaStatus === "submitted" && (
            <div>
              <span>Approve MOA?</span>
              <button onClick={handleApprove}>Approve</button>
              <button onClick={handleReject}>Reject</button>
            </div>
          )}

          <h2>Shipment Information</h2>

          {currentShipments.map((s) => (
            <ShipmentCard
              key={s.id}
              exportDeclaration={s.exportDeclaration}
              invoiceNum={s.invoiceNum}
              boxes={s.boxes}
              datePacked={s.datePacked}
              receiptDate={s.receiptDate}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default LibraryPage;
