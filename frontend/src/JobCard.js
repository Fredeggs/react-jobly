import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";

function JobCard({ title, salary, equity, company }) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h4">{title}</CardTitle>
          <CardText>
            <h5>{company}</h5>
            <p>Salary: {salary}</p>
            <p>Equity: {equity}</p>
          </CardText>
          <Button>Apply</Button>
        </Card>
      </Col>
    </Row>
  );
}

export default JobCard;
