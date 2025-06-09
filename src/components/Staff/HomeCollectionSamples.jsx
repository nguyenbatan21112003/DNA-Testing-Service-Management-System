import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Badge } from 'react-bootstrap';

const HomeCollectionSamples = () => {
  const [formData, setFormData] = useState({
    sampleId: '',
    customerName: '',
    phone: '',
    address: '',
    testTypes: [],
    collectionDate: '',
    collectionTime: '',
    collectingStaff: 'Nguyễn Văn A',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const testTypeOptions = [
    'Xét nghiệm máu',
    'Xét nghiệm nước tiểu',
    'PCR COVID-19',
    'Xét nghiệm ADN',
    'Xét nghiệm gen',
    'Xét nghiệm hormone'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestTypeChange = (testType) => {
    setFormData(prev => ({
      ...prev,
      testTypes: prev.testTypes.includes(testType)
        ? prev.testTypes.filter(t => t !== testType)
        : [...prev.testTypes, testType]
    }));
  };

  const handleQRScan = () => {
    const simulatedSampleId = 'HC' + Date.now().toString().slice(-6);
    setFormData(prev => ({
      ...prev,
      sampleId: simulatedSampleId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Home collection sample data:', formData);
      alert('Thông tin mẫu đã được lưu thành công!');
      
      setFormData({
        sampleId: '',
        customerName: '',
        phone: '',
        address: '',
        testTypes: [],
        collectionDate: '',
        collectionTime: '',
        collectingStaff: 'Nguyễn Văn A',
        notes: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy? Dữ liệu đã nhập sẽ bị mất.')) {
      setFormData({
        sampleId: '',
        customerName: '',
        phone: '',
        address: '',
        testTypes: [],
        collectionDate: '',
        collectionTime: '',
        collectingStaff: 'Nguyễn Văn A',
        notes: ''
      });
    }
  };

  const isFormValid = () => {
    return formData.sampleId &&
           formData.customerName &&
           formData.phone &&
           formData.address &&
           formData.testTypes.length > 0 &&
           formData.collectionDate &&
           formData.collectionTime;
  };

  return (
    <Container fluid className="home-collection-samples">
      <Row className="mb-4">
        <Col>
          <h1>Tiếp nhận mẫu lấy tại nhà</h1>
        </Col>
      </Row>
      
      <Form onSubmit={handleSubmit}>
        {/* Sample ID Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Thông tin mẫu</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mã mẫu *</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="sampleId"
                  value={formData.sampleId}
                  onChange={handleInputChange}
                  placeholder="Nhập mã mẫu"
                  required
                />
                <Button variant="outline-secondary" onClick={handleQRScan}>
                  📷 Quét QR
                </Button>
              </InputGroup>
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Customer Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Thông tin khách hàng</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên khách hàng *</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ đầy đủ"
                required
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Test Type Selection */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Loại xét nghiệm yêu cầu *</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {testTypeOptions.map(testType => (
                <Col md={6} lg={4} key={testType} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label={testType}
                    checked={formData.testTypes.includes(testType)}
                    onChange={() => handleTestTypeChange(testType)}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Collection Details */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Chi tiết thu mẫu</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày lấy mẫu *</Form.Label>
                  <Form.Control
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian lấy mẫu *</Form.Label>
                  <Form.Control
                    type="time"
                    name="collectionTime"
                    value={formData.collectionTime}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nhân viên thực hiện</Form.Label>
                  <Form.Select
                    name="collectingStaff"
                    value={formData.collectingStaff}
                    onChange={handleInputChange}
                  >
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                    <option value="Lê Văn C">Lê Văn C</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Sample Status */}
        <Card className="mb-4">
          <Card.Body className="text-center">
            <Badge bg="success" className="fs-6 p-2">
              Trạng thái mẫu: Đã thu mẫu
            </Badge>
          </Card.Body>
        </Card>

        {/* Notes */}
        <Card className="mb-4">
          <Card.Body>
            <Form.Group>
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Nhập ghi chú về quá trình lấy mẫu (nếu có)"
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Col className="d-flex gap-3">
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin mẫu'}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              size="lg"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default HomeCollectionSamples;