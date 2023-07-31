import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";

function LibraryCard({
  adminFirstName,
  adminLastName,
  adminEmail,
  adminPhone,
  USContactFirstName,
  USContactLastName,
  USContactEmail,
  USContactPhone,
  PHContactFirstName,
  PHContactLastName,
  PHContactEmail,
  PHContactPhone,
  primaryBarangay,
  primaryCity,
  primaryProvince,
  primaryRegion,
  primaryStreet,
  moaStatus,
  readingSpaces,
  libraryName,
  libraryType,
  readingProgram,
  teachers,
  classrooms,
  studentsPerGrade,
  totalResidents,
  elementaryVisitors,
  highSchoolVisitors,
  collegeVisitors,
  adultVisitors,
}) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h4">{libraryName}</CardTitle>
          <CardText tag="h5">
            <div>
              <u>Library Details:</u>
            </div>
            <div>Library Type: {libraryType}</div>
            {libraryType === "community" && (
              <>
                <div>Total Residents: {totalResidents}</div>
                <div>
                  Elementary Age Visitors in the last 6 Months:{" "}
                  {elementaryVisitors}
                </div>
                <div>
                  High School Age Visitors in the last 6 Months:{" "}
                  {highSchoolVisitors}
                </div>
                <div>
                  College Age Visitors in the last 6 Months: {collegeVisitors}
                </div>
                <div>
                  Adult Age Visitors in the last 6 Months: {adultVisitors}
                </div>
              </>
            )}
            {libraryType != "community" && (
              <>
                <div>Teachers: {teachers}</div>
                <div>Classrooms: {classrooms}</div>
                <div>Students Per Grade: {studentsPerGrade}</div>
              </>
            )}
            <div>Reading Program: {readingProgram}</div>
            <div>
              Reading Spaces:{" "}
              {readingSpaces.length
                ? readingSpaces.map((space) => space + " ")
                : "none"}
            </div>
            <div>MOA Status: {moaStatus || "not submitted"}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>Library Admin Contact:</u>
            </div>
            <div>Name: {adminFirstName + " " + adminLastName}</div>
            <div>Email: {adminEmail}</div>
            <div>Phone: {adminPhone}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>US Sponsor:</u>
            </div>
            <div>Name: {USContactFirstName + " " + USContactLastName}</div>
            <div>Email: {USContactEmail}</div>
            <div>Phone: {USContactPhone}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>Philippines Sponsor:</u>
            </div>
            <div>Name: {PHContactFirstName + " " + PHContactLastName}</div>
            <div>Email: {PHContactEmail}</div>
            <div>Phone: {PHContactPhone}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>Primary Address:</u>
            </div>
            <div>Street Address: {primaryStreet}</div>
            <div>Barangay: {primaryBarangay}</div>
            <div>City: {primaryCity}</div>
            <div>Province: {primaryProvince}</div>
            <div>Region: {primaryRegion}</div>
          </CardText>
        </Card>
      </Col>
    </Row>
  );
}

export default LibraryCard;
