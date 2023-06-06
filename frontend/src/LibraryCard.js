import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";

function LibraryCard({
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
            <div>MOA Status: {moaStatus}</div>
            <div>Primary Address</div>
            <div>Street: {primaryStreet}</div>
            <div>Barangay: {primaryBarangay}</div>
            <div>City: {primaryCity}</div>
            <div>Province: {primaryProvince}</div>
            <div>Region: {primaryRegion}</div>
            <div>Shipping Address</div>
            <div>Street: {shippingStreet}</div>
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
