import React, { useState, useContext, useEffect, useRef } from "react";
import { useFormik } from "formik";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";
import BasicLibraryDetails from "./LibraryFormComponents/BasicLibraryDetails";
import AdvancedLibraryDetails from "./LibraryFormComponents/AdvancedLibraryDetails";
import PrimaryAddressDetails from "./LibraryFormComponents/PrimaryAddressDetails";
import USSponsorDetails from "./LibraryFormComponents/USSponsorDetails";
import PHSponsorDetails from "./LibraryFormComponents/PHSponsorDetails";
import { basicLibraryDetailsSchema } from "./schemas/basicLibraryDetailsSchema";
import { libraryAddressDetailsSchema } from "./schemas/libraryAddressDetailsSchema";
import { PHContactDetailsSchema } from "./schemas/PHContactDetailsSchema";
import { USContactDetailsSchema } from "./schemas/USContactDetailsSchema";
import WebViewer, { Core, saveByteArray } from "@pdftron/webviewer";

const documentPath = "./jpgs/MOA_template.docx";

function LibraryForm({ createLibrary, getRegionsAndProvinces, updateToken }) {
  const history = useHistory();
  const viewer = useRef(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const INITIAL_FORM_DATA = {
    libraryData: {
      program: "none",
    },
    readingSpaces: [],
    adminId: currentUser.id,
  };

  const formikBasicLibraryData = useFormik({
    initialValues: {
      libraryName: "",
      libraryType: "",
      classrooms: 0,
      teachers: 0,
      studentsPerGrade: 0,
      totalResidents: 0,
      elementaryVisitors: 0,
      highSchoolVisitors: 0,
      collegeVisitors: 0,
      adultVisitors: 0,
    },
    validationSchema: basicLibraryDetailsSchema,
  });

  const formikPrimaryAddressData = useFormik({
    initialValues: {
      street: "",
      barangay: "",
      city: "",
      provinceId: "",
      regionId: "",
    },
    validationSchema: libraryAddressDetailsSchema,
  });

  const formikPHContactData = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+63",
    },
    validationSchema: PHContactDetailsSchema,
  });

  const formikUSContactData = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+1",
    },
    validationSchema: USContactDetailsSchema,
  });

  const [page, setPage] = useState(0);
  const [readingProgram, setReadingProgram] = useState("none");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [disableNext, setDisableNext] = useState(true);
  const [formTouched, setFormTouched] = useState(false);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((formData) => ({
      ...formData,
      [dataset.tag]: { ...formData[dataset.tag], [name]: value },
    }));
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
    let formattedFormData;
    formattedFormData = {
      ...formData,
      libraryData: {
        ...formData.libraryData,
        ...formikBasicLibraryData.values,
      },
      USContact: {
        ...formikUSContactData.values,
      },
      PHContact: {
        ...formikPHContactData.values,
      },
      primaryAddress: {
        ...formikPrimaryAddressData.values,
        regionId: parseInt(formikPrimaryAddressData.values.regionId),
        provinceId: parseInt(formikPrimaryAddressData.values.provinceId),
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
          formik={formikBasicLibraryData}
          setDisableNext={setDisableNext}
          setFormTouched={setFormTouched}
        />
      );
    } else if (page === 1) {
      return (
        <PrimaryAddressDetails
          formik={formikPrimaryAddressData}
          setDisableNext={setDisableNext}
          setFormTouched={setFormTouched}
          currentUser={currentUser}
          getRegionsAndProvinces={getRegionsAndProvinces}
        />
      );
    } else if (page === 2) {
      return (
        <PHSponsorDetails
          formik={formikPHContactData}
          setDisableNext={setDisableNext}
          setFormTouched={setFormTouched}
        />
      );
    } else if (page === 3) {
      return (
        <USSponsorDetails
          formik={formikUSContactData}
          setDisableNext={setDisableNext}
          setFormTouched={setFormTouched}
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

  // if using a class, equivalent of componentDidMount
  // useEffect(() => {
  //   const Core = window.Core;
  //   Core.setWorkerPath("/webviewer/core");
  //   Core.enableFullPDF();
  //   console.log(Core);

  //   const generatePDF = async function () {
  //     const newPDF = await Core.officeToPDFBuffer(documentPath, {
  //       1: "demo:1691023836731:7c41496103000000005573cd05c5287ac1d08cc22d2ecbc44a55c07353",
  //     });
  //     // .then(async (buffer) => {
  //     //   const PDF = await saveByteArray("generated_document.pdf", buffer);
  //     //   console.log(PDF);
  //     // });
  //     return newPDF;
  //   };
  //   const PDF = generatePDF();
  //   console.log(PDF);
  // });

  return (
    <div>
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
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
              disabled={disableNext || !formTouched}
              style={
                disableNext || !formTouched ? { backgroundColor: "grey" } : {}
              }
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
