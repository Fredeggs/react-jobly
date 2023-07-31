import React, { useState, useContext, useEffect, useRef } from "react";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";
import BasicLibraryDetails from "./LibraryFormComponents/BasicLibraryDetails";
import AdvancedLibraryDetails from "./LibraryFormComponents/AdvancedLibraryDetails";
import PrimaryAddressDetails from "./LibraryFormComponents/PrimaryAddressDetails";
import USSponsorDetails from "./LibraryFormComponents/USSponsorDetails";
import PHSponsorDetails from "./LibraryFormComponents/PHSponsorDetails";

function LibraryForm({ createLibrary, getRegionsAndProvinces, updateToken }) {
  const history = useHistory();
  // const libraryTypeRef = useRef(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const INITIAL_FORM_DATA = {
    libraryData: {
      libraryName: "",
      libraryType: "",
      program: "none",
      classrooms: 0,
      teachers: 0,
      studentsPerGrade: 0,
      totalResidents: 0,
      elementaryVisitors: 0,
      highSchoolVisitors: 0,
      collegeVisitors: 0,
      adultVisitors: 0,
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
    readingSpaces: [],
    adminId: currentUser.id,
  };
  const [page, setPage] = useState(0);
  const [libraryType, setLibraryType] = useState("");
  const [readingProgram, setReadingProgram] = useState("none");
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [USPhone, setUSPhone] = useState("");
  const [PHPhone, setPHPhone] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((formData) => ({
      ...formData,
      [dataset.tag]: { ...formData[dataset.tag], [name]: value },
    }));
  };

  const handleLibraryTypeChange = (e) => {
    const { name, value, dataset } = e.target;
    if (value === "community" || value === "") {
      setFormData((formData) => ({
        ...formData,
        libraryData: {
          ...formData.libraryData,
          teachers: 0,
          classrooms: 0,
          studentsPerGrade: 0,
        },
      }));
    }
    setFormData((formData) => ({
      ...formData,
      [dataset.tag]: { ...formData[dataset.tag], [name]: value },
    }));
    setLibraryType(value);
  };

  const handleProgramChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((formData) => ({
      ...formData,
      [dataset.tag]: { ...formData[dataset.tag], [name]: value },
    }));
    setReadingProgram(value);
  };

  const handleCheckBoxChange = (e) => {
    const { checked, name } = e.target;
    if (checked) {
      setFormData((formData) => {
        formData.readingSpaces.push(name);
        return formData;
      });
    } else {
      setFormData((formData) => {
        const idx = formData.readingSpaces.indexOf(name);
        formData.readingSpaces.splice(idx, 1);
        return formData;
      });
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    let formattedFormData;
    formattedFormData = {
      ...formData,
      USContact: {
        ...formData.USContact,
        phone: USPhone,
      },
      PHContact: {
        ...formData.PHContact,
        phone: PHPhone,
      },
      primaryAddress: {
        ...formData.primaryAddress,
        regionId: parseInt(formData.primaryAddress.regionId),
        provinceId: parseInt(formData.primaryAddress.provinceId),
      },
    };
    console.log(formattedFormData);
    // const libraryRes = await createLibrary(formattedFormData);
    // await updateToken({
    //   ...currentUser,
    //   libraryId: libraryRes.id,
    // });

    // setFormData(INITIAL_FORM_DATA);
    // setCurrentUser(currentUser);
    // history.push("/");
  };

  const FormTitles = [
    "Library Details",
    "Library Address",
    "Filipino Sponsor Contact Information",
    "US Sponsor Contact Information",
    "Advanced Library Details",
  ];
  const PageDisplay = () => {
    if (page === 0) {
      return (
        <BasicLibraryDetails
          formData={formData}
          handleChange={handleChange}
          libraryType={libraryType}
          handleLibraryTypeChange={handleLibraryTypeChange}
        />
      );
    } else if (page === 1) {
      return (
        <PrimaryAddressDetails
          formData={formData}
          handleChange={handleChange}
          regionOptions={regionOptions}
          provinceOptions={provinceOptions}
        />
      );
    } else if (page === 2) {
      return (
        <PHSponsorDetails
          formData={formData}
          handleChange={handleChange}
          PHPhone={PHPhone}
          setPHPhone={setPHPhone}
        />
      );
    } else if (page === 3) {
      return (
        <USSponsorDetails
          formData={formData}
          handleChange={handleChange}
          USPhone={USPhone}
          setUSPhone={setUSPhone}
        />
      );
    } else if (page === 4) {
      return (
        <AdvancedLibraryDetails
          formData={formData}
          handleChange={handleChange}
          readingProgram={readingProgram}
          handleProgramChange={handleProgramChange}
          handleCheckBoxChange={handleCheckBoxChange}
          handleSubmit={handleSubmit}
        />
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch data
      console.log("fetching");
      const data = await getRegionsAndProvinces();
      const { regions, provinces } = data;
      // Update the options state
      setRegionOptions([{ name: "Select a region", value: "" }, ...regions]);
      setProvinceOptions([
        { name: "Select a province", value: "" },
        ...provinces,
      ]);
    }
    // Trigger the fetch
    fetchData();
  }, [currentUser]);

  return (
    <div>
      <h1>Register a Library</h1>
      <div className="form">
        <div className="progressbar">
          <div
            style={{
              width:
                page === 0
                  ? "20%"
                  : page == 1
                  ? "40%"
                  : page == 2
                  ? "60%"
                  : page == 3
                  ? "80%"
                  : "100%",
            }}
          ></div>
        </div>
        <div className="form-container">
          <div className="header">
            <h1>{FormTitles[page]}</h1>
          </div>
          <div className="body">{PageDisplay()}</div>
          <div className="footer">
            {page != 0 && (
              <button
                onClick={() => {
                  setPage((currPage) => currPage - 1);
                }}
              >
                Prev
              </button>
            )}
            <button
              onClick={() => {
                if (page === FormTitles.length - 1) {
                  handleSubmit();
                } else {
                  setPage((currPage) => currPage + 1);
                }
              }}
            >
              {page === FormTitles.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryForm;
