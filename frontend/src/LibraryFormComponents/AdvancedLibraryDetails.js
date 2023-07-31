import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";

function AdvancedLibraryDetails({
  formData,
  readingProgram,
  handleChange,
  handleProgramChange,
  handleCheckBoxChange,
}) {
  return (
    <div className="advanced-library-details-container">
      {readingProgram != "none" ? (
        <label htmlFor="program">
          Does the library have a Reading Program in place?
        </label>
      ) : (
        <label htmlFor="program">
          Does the library have a Reading Program in place? **If no, we{" "}
          <u>HIGHLY ENCOURAGE</u> training from BKP Philippines**
        </label>
      )}

      <select
        id="program"
        name="program"
        data-tag="libraryData"
        type="select"
        value={formData.libraryData.program}
        onChange={handleProgramChange}
      >
        <option value={"none"} default>
          No
        </option>
        <option value={""}>Yes</option>
      </select>
      {readingProgram != "none" && (
        <>
          <label htmlFor="program">Specify Here:</label>
          <input
            id="program"
            name="program"
            data-tag="libraryData"
            type="text"
            value={formData.libraryData.program}
            onChange={handleChange}
          />
        </>
      )}

      <div className="checkboxes">
        <label className="checkboxes-title" htmlFor="readingSpaces">
          Available Reading Spaces (Check all that apply)
        </label>
        <input
          id="reading-corner"
          name="reading corner"
          data-tag="reading-corner"
          type="checkbox"
          onChange={handleCheckBoxChange}
        />
        <label className="checkbox-labels" htmlFor="reading-corner">
          Reading Corner
        </label>
        <input
          id="dedicated-reading-room"
          name="dedicated reading room"
          data-tag="dedicated-reading-room"
          type="checkbox"
          onChange={handleCheckBoxChange}
        />
        <label className="checkbox-labels" htmlFor="dedicated-reading-room">
          Dedicated Reading Room
        </label>
      </div>
    </div>
  );
}

export default AdvancedLibraryDetails;
