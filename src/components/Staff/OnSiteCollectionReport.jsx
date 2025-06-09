import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Badge } from 'react-bootstrap';

const OnSiteCollectionReport = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    birthDate: '',
    gender: '',
    isNewCustomer: false,
    registeredTests: [],
    sampleId: 'OS' + Date.now().toString().slice(-6),
    collectionTime: new Date().toLocaleTimeString('vi-VN', { hour12: false }).slice(0, 5),
    performedBy: 'Nguyễn Văn A',
    sampleType: '',
    tubeCount: 1,
    notes: '',
    consentGiven: false
  });

  const [customerFound, setCustomerFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testOptions = [
    'Xét nghiệm ADN',
    'Xét nghiệm máu tổng quát',
    'Xét nghiệm nước tiểu',
    'PCR COVID-19',
    'Xét nghiệm gen',
    'Xét nghiệm hormone',
    'Xét nghiệm sinh hóa'
  ];

  const sampleTypeOptions = [
    'Máu',
    'Nước tiểu',
    'Dịch tỵ hầu',
    'Mô sinh thiết',
    'Nước bọt'
  ];

  const handleCustomerSearch = () => {
    if (!searchTerm) return;
    
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        customerId: 'CUS001',
        customerName: 'Nguyễn Thị Lan',
        birthDate: '1990-05-15',
        gender: 'Nữ'
      }));
      setCustomerFound(true);
    }, 500);
  };

  const handleNewCustomer = () => {
    setFormData(prev => ({
      ...prev,
      isNewCustomer: true,
      customerId: 'NEW' + Date.now().toString().slice(-6),
      customerName: '',
      birthDate: '',
      gender: ''
    }));
    setCustomerFound(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTestChange = (test) => {
    setFormData(prev => ({
      ...prev,
      registeredTests: prev.registeredTests.includes(test)
        ? prev.registeredTests.filter(t => t !== test)
        : [...prev.registeredTests, test]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('On-site collection data:', formData);
      alert('Biên bản lấy mẫu đã được lưu và cập nhật thành công!');
      
      setFormData({
        customerId: '',
        customerName: '',
        birthDate: '',
        gender: '',
        isNewCustomer: false,
        registeredTests: [],
        sampleId: 'OS' + Date.now().toString().slice(-6),
        collectionTime: new Date().toLocaleTimeString('vi-VN', { hour12: false }).slice(0, 5),
        performedBy: 'Nguyễn Văn A',
        sampleType: '',
        tubeCount: 1,
        notes: '',
        consentGiven: false
      });
      
      setCustomerFound(false);
      setSearchTerm('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePrintReport = () => {
    console.log('Printing report for:', formData);
    alert('Đang tạo và in biên bản...');
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy? Dữ liệu đã nhập sẽ bị mất.')) {
      setFormData({
        customerId: '',
        customerName: '',
        birthDate: '',
        gender: '',
        isNewCustomer: false,
        registeredTests: [],
        sampleId: 'OS' + Date.now().toString().slice(-6),
        collectionTime: new Date().toLocaleTimeString('vi-VN', { hour12: false }).slice(0, 5),
        performedBy: 'Nguyễn Văn A',
        sampleType: '',
        tubeCount: 1,
        notes: '',
        consentGiven: false
      });
      setCustomerFound(false);
      setSearchTerm('');
    }
  };

  const isFormValid = () => {
    return formData.customerName &&
           formData.birthDate &&
           formData.gender &&
           formData.registeredTests.length > 0 &&
           formData.sampleType &&
           formData.tubeCount > 0 &&
           formData.consentGiven;
  };

  return (
    <Container fluid className="onsite-collection-report">
      <Row className="mb-4">
        <Col>
          <h1>Điền biên bản lấy mẫu tại cơ sở</h1>
        </Col>
      </Row>
      
      <Form onSubmit={handleSubmit}>
        {/* Customer Identification */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Xác định khách hàng</h5>
          </Card.Header>
          <Card.Body>
            {!customerFound ? (
              <>
                <Row className="mb-3">
                  <Col>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm khách hàng theo tên hoặc ID"
                      />
                      <Button variant="primary" onClick={handleCustomerSearch}>
                        Tìm kiếm
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Button
                      variant="outline-success"
                      onClick={handleNewCustomer}
                    >
                      Tạo hồ sơ khách hàng mới
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên khách hàng *</Form.Label>
                      <Form.Control
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        readOnly={!formData.isNewCustomer}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày sinh *</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                        readOnly={!formData.isNewCustomer}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giới tính *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.isNewCustomer}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                {!formData.isNewCustomer && (
                  <Button
                    variant="outline-warning"
                    onClick={() => {
                      setCustomerFound(false);
                      setSearchTerm('');
                    }}
                  >
                    Thay đổi khách hàng
                  </Button>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        {customerFound && (
          <>
            {/* Test Selection */}
            <Card className="mb-4">
              <Card.Header>
                <h5>Các xét nghiệm đăng ký *</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {testOptions.map(test => (
                    <Col md={6} lg={4} key={test} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={test}
                        checked={formData.registeredTests.includes(test)}
                        onChange={() => handleTestChange(test)}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Sample Details */}
            <Card className="mb-4">
              <Card.Header>
                <h5>Chi tiết mẫu</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mã mẫu</Form.Label>
                      <Form.Control
                        type="text"
                        name="sampleId"
                        value={formData.sampleId}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian lấy mẫu</Form.Label>
                      <Form.Control
                        type="time"
                        name="collectionTime"
                        value={formData.collectionTime}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Người thực hiện</Form.Label>
                      <Form.Select
                        name="performedBy"
                        value={formData.performedBy}
                        onChange={handleInputChange}
                      >
                        <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                        <option value="Trần Thị B">Trần Thị B</option>
                        <option value="Lê Văn C">Lê Văn C</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Loại mẫu *</Form.Label>
                      <Form.Select
                        name="sampleType"
                        value={formData.sampleType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn loại mẫu</option>
                        {sampleTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lượng ống/lọ *</Form.Label>
                      <Form.Control
                        type="number"
                        name="tubeCount"
                        value={formData.tubeCount}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                    placeholder="Ghi chú về quá trình lấy mẫu"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Consent */}
            <Card className="mb-4">
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  name="consentGiven"
                  checked={formData.consentGiven}
                  onChange={handleInputChange}
                  label="Khách hàng đã đồng ý lấy mẫu và hiểu rõ quy trình *"
                  required
                  className="fs-6"
                />
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
                  {isSubmitting ? 'Đang lưu...' : 'Lưu và Cập nhật mẫu'}
                </Button>
                <Button
                  type="button"
                  variant="info"
                  size="lg"
                  onClick={handlePrintReport}
                  disabled={!isFormValid()}
                >
                  In biên bản
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
          </>
        )}
      </Form>
    </Container>
  );
};

export default OnSiteCollectionReport;