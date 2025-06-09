import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, InputGroup } from 'react-bootstrap';

const ConsultationRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [status, setStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const mockRequests = [
    {
      id: 'REQ001',
      customerName: 'Trần Thị B',
      email: 'tran.b@email.com',
      phone: '0987654321',
      subject: 'Hỏi về quy trình xét nghiệm ADN',
      content: 'Tôi muốn biết quy trình xét nghiệm ADN như thế nào?',
      date: '15/12/2024',
      status: 'Mới'
    },
    {
      id: 'REQ002',
      customerName: 'Lê Văn C',
      email: 'le.c@email.com',
      phone: '0123456789',
      subject: 'Thời gian có kết quả',
      content: 'Xét nghiệm ADN mất bao lâu để có kết quả?',
      date: '14/12/2024',
      status: 'Đang xử lý'
    }
  ];

  const getStatusVariant = (status) => {
    const statusVariants = {
      'Mới': 'danger',
      'Đang xử lý': 'warning',
      'Đã phản hồi': 'success'
    };
    return statusVariants[status] || 'secondary';
  };

  const handleSendResponse = () => {
    if (!response.trim()) return;
    
    console.log('Sending response:', {
      requestId: selectedRequest.id,
      response,
      sendEmail,
      status,
      internalNotes
    });
    
    alert('Phản hồi đã được gửi thành công');
    setResponse('');
    setStatus('Đã phản hồi');
  };

  return (
    <Container fluid className="consultation-requests">
      <Row className="mb-4">
        <Col>
          <h1>Xử lý yêu cầu tư vấn</h1>
        </Col>
      </Row>
      
      <Row>
        {/* Left Panel - Request List */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Danh sách yêu cầu</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm yêu cầu"
                  />
                </Col>
                <Col md={3}>
                  <Form.Select>
                    <option>Tất cả trạng thái</option>
                    <option>Mới</option>
                    <option>Đã phản hồi</option>
                    <option>Đang xử lý</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Control type="date" />
                </Col>
              </Row>

              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Tiêu đề</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRequests.map(request => (
                    <tr
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      style={{ cursor: 'pointer' }}
                      className={selectedRequest?.id === request.id ? 'table-active' : ''}
                    >
                      <td>{request.id}</td>
                      <td>{request.customerName}</td>
                      <td>{request.subject}</td>
                      <td>{request.date}</td>
                      <td>
                        <Badge bg={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel - Request Detail & Response */}
        <Col lg={6} className="mb-4">
          {selectedRequest ? (
            <Card>
              <Card.Header>
                <h5>Chi tiết yêu cầu - {selectedRequest.id}</h5>
              </Card.Header>
              <Card.Body>
                <Card className="mb-3">
                  <Card.Body>
                    <h6>Thông tin khách hàng</h6>
                    <p><strong>Tên:</strong> {selectedRequest.customerName}</p>
                    <p><strong>Email:</strong> {selectedRequest.email}</p>
                    <p><strong>Số điện thoại:</strong> {selectedRequest.phone}</p>
                  </Card.Body>
                </Card>

                <Card className="mb-3">
                  <Card.Body>
                    <h6>Nội dung yêu cầu</h6>
                    <p>{selectedRequest.content}</p>
                  </Card.Body>
                </Card>

                <Form.Group className="mb-3">
                  <Form.Label>Nội dung phản hồi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Nhập nội dung phản hồi..."
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Check
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      label="Gửi qua Email"
                    />
                  </Col>
                  <Col>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Cập nhật trạng thái</option>
                      <option value="Đã phản hồi">Đã phản hồi</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đóng">Đóng</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú nội bộ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Ghi chú cho nhân viên..."
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleSendResponse}
                  disabled={!response.trim()}
                >
                  Gửi phản hồi
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="text-center">
                <p className="text-muted">Chọn một yêu cầu để xem chi tiết</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ConsultationRequests;