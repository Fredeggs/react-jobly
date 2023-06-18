import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";

function LibraryCard({
  adminFirstName,
  adminLastName,
  adminEmail,
  adminPhone,
  contactFirstName,
  contactLastName,
  contactEmail,
  contactPhone,
  libraryName,
  libraryType,
  primaryBarangay,
  primaryCity,
  primaryProvince,
  primaryRegion,
  primaryStreet,
  shippingBarangay,
  shippingCity,
  shippingProvince,
  shippingRegion,
  shippingStreet,
  moaStatus,
}) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h4">{libraryName}</CardTitle>
          <CardText tag="h5">
            <div>Library Type: {libraryType}</div>
            <div>MOA Status: {moaStatus || "not submitted"}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>Primary Contact (Library Admin):</u>
            </div>
            <div>Name: {adminFirstName + " " + adminLastName}</div>
            <div>Email: {adminEmail}</div>
            <div>Phone: {adminPhone}</div>
          </CardText>
          <CardText tag="h5">
            <div>
              <u>Secondary Contact:</u>
            </div>
            <div>Name: {contactFirstName + " " + contactLastName}</div>
            <div>Email: {contactEmail}</div>
            <div>Phone: {contactPhone}</div>
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
          <CardText tag="h5">
            <div>
              <u>Shipping Address:</u>
            </div>
            <div>Street Address: {shippingStreet}</div>
            <div>Barangay: {shippingBarangay}</div>
            <div>City: {shippingCity}</div>
            <div>Province: {shippingProvince}</div>
            <div>Region: {shippingRegion}</div>
          </CardText>
        </Card>
      </Col>
    </Row>
  );
}

export default LibraryCard;
