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
    shippingAddress: {
      street: "",
      barangay: "",
      city: "",
      provinceId: "",
      regionId: "",
    },
    contactData: { firstName: "", lastName: "", email: "", phone: "" },
    adminId: currentUser.id,
  };
  const [libraryType, setLibraryType] = useState("");
  const [readingProgram, setReadingProgram] = useState("");
  const [teachers, setTeachers] = useState("");
  const [classrooms, setClassrooms] = useState("");
  const [studentsPerGrade, setStudentsPerGrade] = useState("");
  const [isChecked, setIsChecked] = useState(true);
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
    const { checked } = e.target;
    if (checked) {
      setFormData((formData) => ({
        ...formData,
        shippingAddress: { ...formData.primaryAddress },
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        shippingAddress: {
          street: "",
          barangay: "",
          city: "",
          provinceId: "",
          regionId: "",
        },
      }));
    }
    setIsChecked(!isChecked);
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
    if (isChecked) {
      formattedFormData = {
        ...formData,
        primaryAddress: {
          ...formData.primaryAddress,
          regionId: parseInt(formData.primaryAddress.regionId),
          provinceId: parseInt(formData.primaryAddress.provinceId),
        },
        shippingAddress: {
          ...formData.primaryAddress,
          regionId: parseInt(formData.primaryAddress.regionId),
          provinceId: parseInt(formData.primaryAddress.provinceId),
        },
      };
    } else {
      formattedFormData = {
        ...formData,
        primaryAddress: {
          ...formData.primaryAddress,
          regionId: parseInt(formData.primaryAddress.regionId),
          provinceId: parseInt(formData.primaryAddress.provinceId),
        },
        shippingAddress: {
          ...formData.shippingAddress,
          regionId: parseInt(formData.shippingAddress.regionId),
          provinceId: parseInt(formData.shippingAddress.provinceId),
        },
      };
    }
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
          <Label for="library-name">Library Name</Label>
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
            <option value={"elementary school"}>Elementary School</option>
            <option value={"middle school"}>Middle School</option>
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

        <h3>Primary Address</h3>
        <FormGroup>
          <Label for="p-street">Street</Label>
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
          <Label for="p-city">City</Label>
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
        <h3>Shipping Address</h3>
        <FormGroup>
          <Label for="same-address">Same as Primary Address? </Label>
          <Input
            id="same-address"
            name="sameAddress"
            type="checkbox"
            defaultChecked={isChecked}
            onChange={handleCheckBoxChange}
          />
        </FormGroup>
        {isChecked ? (
          <></>
        ) : (
          <>
            <FormGroup>
              <Label for="s-street">Street</Label>
              <Input
                id="s-street"
                name="street"
                data-tag="shippingAddress"
                type="text"
                value={formData.shippingAddress.street}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="s-barangay">Barangay</Label>
              <Input
                id="s-barangay"
                name="barangay"
                data-tag="shippingAddress"
                type="text"
                value={formData.shippingAddress.barangay}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="s-city">City</Label>
              <Input
                id="s-city"
                name="city"
                data-tag="shippingAddress"
                type="text"
                value={formData.shippingAddress.city}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="s-province">Province</Label>
              <Input
                id="s-province"
                name="provinceId"
                data-tag="shippingAddress"
                type="select"
                value={formData.shippingAddress.provinceId}
                onChange={handleChange}
              >
                {provinceOptions.map((option) => {
                  return (
                    <option key={"sp-" + option.id} value={option.id}>
                      {option.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="s-region">Region</Label>
              <Input
                id="s-region"
                name="regionId"
                data-tag="shippingAddress"
                type="select"
                value={formData.shippingAddress.regionId}
                onChange={handleChange}
              >
                {regionOptions.map((option) => {
                  return (
                    <option key={"sr-" + option.id} value={option.id}>
                      {option.name}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </>
        )}

        <h3>Library Contact</h3>
        <FormGroup>
          <Label for="first-name">First Name</Label>
          <Input
            id="first-name"
            name="firstName"
            data-tag="contactData"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="last-name">Last Name</Label>
          <Input
            id="last-name"
            name="lastName"
            data-tag="contactData"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            id="email"
            name="email"
            data-tag="contactData"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            data-tag="contactData"
            type="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default LibraryForm;
