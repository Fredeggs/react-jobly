import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

function BasicLibraryDetails({ formik }) {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  console.log(errors);
  return (
    <form className="basic-library-details-container">
      <label htmlFor="library-name">Library/School Name</label>
      <input
        id="library-name"
        name="libraryName"
        data-tag="libraryData"
        type="text"
        value={values.libraryName}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.libraryName && touched.libraryName ? "input-error" : ""
        }
      />
      {errors.libraryName && touched.libraryName && (
        <p className="error">{errors.libraryName}</p>
      )}

      <label htmlFor="library-type">Library Type</label>
      <select
        id="library-type"
        name="libraryType"
        data-tag="libraryData"
        type="select"
        value={values.libraryType}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.libraryType && touched.libraryType ? "input-error" : ""
        }
      >
        <option value={""} default>
          Select a library type
        </option>
        <option value={"day care"}>Day Care</option>
        <option value={"elementary school"}>Elementary School</option>
        <option value={"high school"}>High School</option>
        <option value={"community"}>Community</option>
      </select>
      {errors.libraryType && touched.libraryType && (
        <p className="error">{errors.libraryType}</p>
      )}

      {values.libraryType != "community" && values.libraryType != "" ? (
        <>
          <label htmlFor="classrooms">Classrooms</label>
          <input
            id="classrooms"
            name="classrooms"
            data-tag="libraryData"
            type="number"
            value={values.classrooms}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.classrooms && touched.classrooms ? "input-error" : ""
            }
          />
          {errors.classrooms && touched.classrooms && (
            <p className="error">{errors.classrooms}</p>
          )}

          <label htmlFor="teachers">Teachers</label>
          <input
            id="teachers"
            name="teachers"
            data-tag="libraryData"
            type="number"
            value={values.teachers}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.teachers && touched.teachers ? "input-error" : ""}
          />
          {errors.teachers && touched.teachers && (
            <p className="error">{errors.teachers}</p>
          )}

          <label htmlFor="students-per-grade">Students Per Grade</label>
          <input
            id="students-per-grade"
            name="studentsPerGrade"
            data-tag="libraryData"
            type="number"
            value={values.studentsPerGrade}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.studentsPerGrade && touched.studentsPerGrade
                ? "input-error"
                : ""
            }
          />
          {errors.studentsPerGrade && touched.studentsPerGrade && (
            <p className="error">{errors.studentsPerGrade}</p>
          )}
        </>
      ) : values.libraryType === "community" && values.libraryType != "" ? (
        <>
          <label htmlFor="total-residents">
            Estimated Total Residents in the Community
          </label>
          <input
            id="total-residents"
            name="totalResidents"
            data-tag="libraryData"
            type="number"
            value={values.totalResidents}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.totalResidents && touched.totalResidents
                ? "input-error"
                : ""
            }
          />
          {errors.totalResidents && touched.totalResidents && (
            <p className="error">{errors.totalResidents}</p>
          )}

          <label htmlFor="elementary-visitors">
            Total Elementary Age Visitors in Past 6 Months
          </label>
          <input
            id="elementary-visitors"
            name="elementaryVisitors"
            data-tag="libraryData"
            type="number"
            value={values.elementaryVisitors}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.elementaryVisitors && touched.elementaryVisitors
                ? "input-error"
                : ""
            }
          />
          {errors.elementaryVisitors && touched.elementaryVisitors && (
            <p className="error">{errors.elementaryVisitors}</p>
          )}

          <label htmlFor="high-school-visitors">
            Total High School Age Visitors in Past 6 Months
          </label>
          <input
            id="high-school-visitors"
            name="highSchoolVisitors"
            data-tag="libraryData"
            type="number"
            value={values.highSchoolVisitors}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.highSchoolVisitors && touched.highSchoolVisitors
                ? "input-error"
                : ""
            }
          />
          {errors.highSchoolVisitors && touched.highSchoolVisitors && (
            <p className="error">{errors.highSchoolVisitors}</p>
          )}

          <label htmlFor="college-visitors">
            Total College Age Visitors in Past 6 Months
          </label>
          <input
            id="college-visitors"
            name="collegeVisitors"
            data-tag="libraryData"
            type="number"
            value={values.collegeVisitors}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.collegeVisitors && touched.collegeVisitors
                ? "input-error"
                : ""
            }
          />
          {errors.collegeVisitors && touched.collegeVisitors && (
            <p className="error">{errors.collegeVisitors}</p>
          )}

          <label htmlFor="adult-visitors">
            Total Adult Age Visitors in Past 6 Months
          </label>
          <input
            id="adult-visitors"
            name="adultVisitors"
            data-tag="libraryData"
            type="number"
            value={values.adultVisitors}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              errors.adultVisitors && touched.adultVisitors ? "input-error" : ""
            }
          />
          {errors.adultVisitors && touched.adultVisitors && (
            <p className="error">{errors.adultVisitors}</p>
          )}
        </>
      ) : (
        <></>
      )}
    </form>
  );
}

export default BasicLibraryDetails;
