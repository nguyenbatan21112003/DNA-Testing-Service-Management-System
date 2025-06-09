import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const StaffDashboard = () => {
  return (
    <Container fluid className="staff-dashboard">
      <Row className="mb-4">
        <Col>
          <h1>Bảng điều khiển nhân viên</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Mẫu chờ xử lý</Card.Title>
              <div className="display-4 text-warning">12</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Yêu cầu tư vấn mới</Card.Title>
              <div className="display-4 text-info">5</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Công việc được giao</Card.Title>
              <div className="display-4 text-primary">8</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Phản hồi chưa xem</Card.Title>
              <div className="display-4 text-success">3</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard;