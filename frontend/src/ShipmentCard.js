import { Row, Col, Card, CardTitle, CardText } from "reactstrap";

function ShipmentCard({
  boxes,
  datePacked,
  exportDeclaration,
  invoiceNum,
  receiptDate,
}) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h4">
            Export Declaration #: {exportDeclaration}
          </CardTitle>
          <CardTitle tag="h4">Invoice #: {invoiceNum}</CardTitle>
          <CardText tag="h5">
            <div>Boxes: {boxes}</div>
            <div>Date Packed: {datePacked}</div>
            <div>Receipt Date: {receiptDate || "not submitted"}</div>
          </CardText>
        </Card>
      </Col>
    </Row>
  );
}

export default ShipmentCard;
