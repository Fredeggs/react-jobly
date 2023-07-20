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
  libraryName,
  libraryType,
  readingProgram,
  primaryBarangay,
  primaryCity,
  primaryProvince,
  primaryRegion,
  primaryStreet,
  moaStatus,
  readingSpaces,
}) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h4">{libraryName}</CardTitle>
          <CardText tag="h5">
            <div>Library Type: {libraryType}</div>
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
