import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import UserContext from "./userContext";

function LibraryForm({ createLibrary, getRegionsAndProvinces, updateToken }) {
  const history = useHistory();
  const libraryTypeRef = useRef(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const INITIAL_FORM_DATA = {
    libraryData: {
      libraryName: "",
      libraryType: "",
      program: "",
      classrooms: 0,
      teachers: 0,
      studentsPerGrade: 0,
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
  const [libraryType, setLibraryType] = useState("");
  const [readingProgram, setReadingProgram] = useState("");
  const [readingCornerChecked, setReadingCornerChecked] = useState(false);
  const [readingRoomChecked, setReadingRoomChecked] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
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
    console.log(e.target);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formattedFormData;
    formattedFormData = {
      ...formData,
      primaryAddress: {
        ...formData.primaryAddress,
        regionId: parseInt(formData.primaryAddress.regionId),
        provinceId: parseInt(formData.primaryAddress.provinceId),
      },
    };
    console.log(formattedFormData);
    const libraryRes = await createLibrary(formattedFormData);
    await updateToken({
      ...currentUser,
      libraryId: libraryRes.id,
    });

    setFormData(INITIAL_FORM_DATA);
    setCurrentUser(currentUser);
    history.push("/");
  };

  return (
    <div>
      <h1>Register a Library</h1>
      <Form>
        <h3>Library Details</h3>
        <FormGroup>
          <Label for="library-name">Library/School Name</Label>
          <Input
            id="library-name"
            name="libraryName"
            data-tag="libraryData"
            type="text"
            value={formData.libraryData.libraryName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="library-type">Library Type</Label>
          <Input
            id="library-type"
            name="libraryType"
            data-tag="libraryData"
            type="select"
            value={formData.libraryData.libraryType}
            onChange={handleLibraryTypeChange}
            ref={libraryTypeRef}
          >
            <option value={""} default>
              Select a library type
            </option>
            <option value={"day care"}>Day Care</option>
            <option value={"elementary school"}>Elementary School</option>
            <option value={"high school"}>High School</option>
            <option value={"community"}>Community</option>
          </Input>
        </FormGroup>
        {libraryType != "community" && libraryType != "" ? (
          <>
            <FormGroup>
              <Label for="classrooms">Classrooms</Label>
              <Input
                id="classrooms"
                name="classrooms"
                data-tag="libraryData"
                type="number"
                value={formData.libraryData.classrooms}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="teachers">Teachers</Label>
              <Input
                id="teachers"
                name="teachers"
                data-tag="libraryData"
                type="number"
                value={formData.libraryData.teachers}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="students-per-grade">Students Per Grade</Label>
              <Input
                id="students-per-grade"
                name="studentsPerGrade"
                data-tag="libraryData"
                type="number"
                value={formData.libraryData.studentsPerGrade}
                onChange={handleChange}
              />
            </FormGroup>
          </>
        ) : (
          <></>
        )}

        <FormGroup>
          <Label for="program">Reading Program</Label>
          <Input
            id="program"
            name="program"
            data-tag="libraryData"
            type="select"
            value={formData.libraryData.program}
            onChange={handleProgramChange}
          >
            <option value={""} default>
              Select a Reading Program or Specify
            </option>
            <option value={"first steps to engaged reading"}>
              First Steps to Engaged Reading
            </option>
            <option value={"reading buddies program"}>
              Reading Buddies Program
            </option>
            <option value={"reading groups"}>Reading Groups</option>
            <option value={"literature circles"}>Literature Circles</option>
          </Input>
          {readingProgram != "reading groups" &&
            readingProgram != "literature circles" &&
            readingProgram != "first steps to engaged reading" &&
            readingProgram != "reading buddies program" && (
              <>
                <Label for="program">Specify Here:</Label>
                <Input
                  id="program"
                  name="program"
                  data-tag="libraryData"
                  type="text"
                  value={formData.libraryData.program}
                  onChange={handleProgramChange}
                />
              </>
            )}
        </FormGroup>
        <FormGroup>
          <Label for="readingSpaces">
            Available Reading Spaces (Check all that apply)
          </Label>
          <div></div>
          <Input
            id="reading-corner"
            name="reading corner"
            data-tag="reading-corner"
            type="checkbox"
            onChange={handleCheckBoxChange}
          />
          <Label for="reading-corner">Reading Corner</Label>
          <Input
            id="dedicated-reading-room"
            name="dedicated reading room"
            data-tag="dedicated-reading-room"
            type="checkbox"
            onChange={handleCheckBoxChange}
          />
          <Label for="dedicated-reading-room">Dedicated Reading Room</Label>
        </FormGroup>

        <h3>Primary Address</h3>
        <FormGroup>
          <Label for="p-street">Street Address</Label>
          <Input
            id="p-street"
            name="street"
            data-tag="primaryAddress"
            type="text"
            value={formData.primaryAddress.street}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="p-barangay">Barangay</Label>
          <Input
            id="p-barangay"
            name="barangay"
            data-tag="primaryAddress"
            type="text"
            value={formData.primaryAddress.barangay}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="p-city">City or Municipality</Label>
          <Input
            id="p-city"
            name="city"
            data-tag="primaryAddress"
            type="text"
            value={formData.primaryAddress.city}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="p-province">Province</Label>
          <Input
            id="p-province"
            name="provinceId"
            data-tag="primaryAddress"
            type="select"
            value={formData.primaryAddress.provinceId}
            onChange={handleChange}
          >
            {provinceOptions.map((option) => {
              return (
                <option key={"pp-" + option.id} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="p-region">Region</Label>
          <Input
            id="p-region"
            name="regionId"
            data-tag="primaryAddress"
            type="select"
            value={formData.primaryAddress.regionId}
            onChange={handleChange}
          >
            {regionOptions.map((option) => {
              return (
                <option key={"pr-" + option.id} value={option.id}>
                  {option.name}
                </option>
              );
            })}
          </Input>
        </FormGroup>

        <h3>US Sponsor Contact Info</h3>
        <FormGroup>
          <Label for="us-first-name">First Name</Label>
          <Input
            id="us-first-name"
            name="firstName"
            data-tag="USContact"
            type="text"
            value={formData.USContact.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="us-last-name">Last Name</Label>
          <Input
            id="us-last-name"
            name="lastName"
            data-tag="USContact"
            type="text"
            value={formData.USContact.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="us-email">Email</Label>
          <Input
            id="us-email"
            name="email"
            data-tag="USContact"
            type="email"
            value={formData.USContact.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="us-phone">Phone</Label>
          <Input
            id="us-phone"
            name="phone"
            data-tag="USContact"
            type="phone"
            value={formData.USContact.phone}
            onChange={handleChange}
          />
        </FormGroup>

        <h3>Filipino Sponsor Contact Info</h3>
        <FormGroup>
          <Label for="ph-first-name">First Name</Label>
          <Input
            id="ph-first-name"
            name="firstName"
            data-tag="PHContact"
            type="text"
            value={formData.PHContact.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="ph-last-name">Last Name</Label>
          <Input
            id="ph-last-name"
            name="lastName"
            data-tag="PHContact"
            type="text"
            value={formData.PHContact.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="ph-email">Email</Label>
          <Input
            id="ph-email"
            name="email"
            data-tag="PHContact"
            type="email"
            value={formData.PHContact.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="ph-phone">Phone</Label>
          <Input
            id="ph-phone"
            name="phone"
            data-tag="PHContact"
            type="phone"
            value={formData.PHContact.phone}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default LibraryForm;
