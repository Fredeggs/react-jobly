import { Row, Col, Card, CardTitle, CardText, Button } from "reactstrap";
import "./CompanyCard.css"

function CompanyCard({ name, description, jobs }) {
  return (
    <Row>
      <Col sm="6">
        <Card body>
          <CardTitle tag="h5">{name}</CardTitle>
          <CardText>{description}</CardText>
          <Button>See job listings for {name}</Button>
        </Card>
      </Col>
    </Row>
  );
}

export default CompanyCard;
