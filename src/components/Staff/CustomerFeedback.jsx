import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Badge, Modal, Card, InputGroup } from 'react-bootstrap';

const CustomerFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const mockFeedback = [
    {
      id: 'FB001',
      customerName: 'Nguyễn Thị Lan',
      email: 'lan.nguyen@email.com',
      phone: '0987654321',
      subject: 'Dịch vụ tốt, nhân viên thân thiện',
      content: 'Tôi rất hài lòng với dịch vụ xét nghiệm ADN tại trung tâm. Nhân viên rất chuyên nghiệp và thân thiện.',
      date: '15/12/2024',
      status: 'Mới',
      rating: 5
    },
    {
      id: 'FB002',
      customerName: 'Ẩn danh',
      email: '',
      phone: '',
      subject: 'Thời gian chờ hơi lâu',
      content: 'Dịch vụ ổn nhưng thời gian chờ kết quả hơi lâu so với dự kiến.',
      date: '14/12/2024',
      status: 'Đã xem',
      rating: 3
    },
    {
      id: 'FB003',
      customerName: 'Trần Văn Minh',
      email: 'minh.tran@email.com',
      phone: '0123456789',
      subject: 'Rất hài lòng với quy trình',
      content: 'Quy trình lấy mẫu tại nhà rất tiện lợi. Nhân viên đến đúng giờ và hướng dẫn rất tận tình.',
      date: '13/12/2024',
      status: 'Mới',
      rating: 4
    }
  ];

  const getStatusVariant = (status) => {
    return status === 'Mới' ? 'primary' : 'secondary';
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleMarkAsReviewed = () => {
    if (selectedFeedback && selectedFeedback.status === 'Mới') {
      console.log(`Marking feedback ${selectedFeedback.id} as reviewed`);
      setSelectedFeedback({...selectedFeedback, status: 'Đã xem'});
    }
  };

  const filteredFeedback = mockFeedback.filter(feedback => {
    const matchesSearch = feedback.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tất cả' || feedback.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container fluid className="customer-feedback">
      <Row className="mb-4">
        <Col>
          <h1>Phản hồi từ khách hàng</h1>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm phản hồi"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Mới</option>
            <option>Đã xem</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID Phản hồi</th>
            <th>Tên khách hàng</th>
            <th>Tiêu đề/Tóm tắt</th>
            <th>Đánh giá</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedback.map(feedback => (
            <tr key={feedback.id}>
              <td><strong>{feedback.id}</strong></td>
              <td>{feedback.customerName || 'Ẩn danh'}</td>
              <td>{feedback.subject}</td>
              <td>
                <span className="text-warning">
                  {getRatingStars(feedback.rating)}
                </span>
              </td>
              <td>{feedback.date}</td>
              <td>
                <Badge bg={getStatusVariant(feedback.status)}>
                  {feedback.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetail(feedback)}
                >
                  👁️ Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Feedback Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phản hồi - {selectedFeedback?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Thông tin khách hàng</h5>
                  <p><strong>Tên khách hàng:</strong> {selectedFeedback.customerName || 'Ẩn danh'}</p>
                  {selectedFeedback.email && (
                    <p><strong>Email:</strong> {selectedFeedback.email}</p>
                  )}
                  {selectedFeedback.phone && (
                    <p><strong>Số điện thoại:</strong> {selectedFeedback.phone}</p>
                  )}
                  <p>
                    <strong>Đánh giá:</strong> 
                    <span className="text-warning ms-2">
                      {getRatingStars(selectedFeedback.rating)} ({selectedFeedback.rating}/5)
                    </span>
                  </p>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5>Nội dung phản hồi</h5>
                  <p>{selectedFeedback.content}</p>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedFeedback?.status === 'Mới' && (
            <Button variant="success" onClick={handleMarkAsReviewed}>
              Đánh dấu đã xem
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerFeedback;