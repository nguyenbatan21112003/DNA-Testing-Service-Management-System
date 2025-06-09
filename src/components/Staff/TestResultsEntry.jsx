import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';

const TestResultsEntry = () => {
  const [sampleId, setSampleId] = useState('');
  const [sampleInfo, setSampleInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [notes, setNotes] = useState('');

  const handleSampleSearch = async () => {
    if (!sampleId) return;
    
    setLoading(true);
    setTimeout(() => {
      setSampleInfo({
        patientName: 'Nguyễn Văn A',
        collectionDate: '15/12/2024',
        requestedTests: [
          { name: 'Glucose', unit: 'mg/dL', range: '70-100', type: 'number' },
          { name: 'Cholesterol', unit: 'mg/dL', range: '150-200', type: 'number' },
          { name: 'COVID-19', unit: '', range: '', type: 'select', options: ['Âm tính', 'Dương tính'] }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const handleResultChange = (testName, value) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting results:', { sampleId, testResults, notes });
    alert('Kết quả đã được gửi thành công, chờ xác thực');
  };

  const isFormValid = () => {
    if (!sampleInfo) return false;
    return sampleInfo.requestedTests.every(test => testResults[test.name]);
  };

  return (
    <Container fluid className="test-results-entry">
      <Row className="mb-4">
        <Col>
          <h1>Nhập kết quả xét nghiệm</h1>
        </Col>
      </Row>
      
      <Row>
        {/* Left Column - Sample Information */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Thông tin mẫu</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Mã mẫu</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={sampleId}
                    onChange={(e) => setSampleId(e.target.value)}
                    placeholder="Nhập mã mẫu hoặc quét QR"
                  />
                  <Button variant="outline-secondary">📷</Button>
                  <Button variant="primary" onClick={handleSampleSearch}>
                    Tìm kiếm
                  </Button>
                </InputGroup>
              </Form.Group>

              {loading && (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </Spinner>
                </div>
              )}

              {!sampleInfo && !loading && (
                <Alert variant="info">Chưa có mẫu được chọn</Alert>
              )}

              {sampleInfo && (
                <Card className="mt-3">
                  <Card.Body>
                    <h6>Chi tiết mẫu</h6>
                    <p><strong>Tên bệnh nhân:</strong> {sampleInfo.patientName}</p>
                    <p><strong>Ngày lấy mẫu:</strong> {sampleInfo.collectionDate}</p>
                    <p><strong>Xét nghiệm yêu cầu:</strong></p>
                    <ul>
                      {sampleInfo.requestedTests.map(test => (
                        <li key={test.name}>{test.name}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Test Result Input */}
        <Col lg={6} className="mb-4">
          {sampleInfo && (
            <Card>
              <Card.Header>
                <h5>Nhập kết quả xét nghiệm</h5>
              </Card.Header>
              <Card.Body>
                {sampleInfo.requestedTests.map(test => (
                  <Form.Group key={test.name} className="mb-3">
                    <Form.Label>{test.name}</Form.Label>
                    {test.type === 'number' ? (
                      <>
                        <Form.Control
                          type="number"
                          value={testResults[test.name] || ''}
                          onChange={(e) => handleResultChange(test.name, e.target.value)}
                          placeholder={`Nhập kết quả ${test.name}`}
                        />
                        <Form.Text className="text-muted">
                          Đơn vị: {test.unit} | Khoảng tham chiếu: {test.range}
                        </Form.Text>
                      </>
                    ) : (
                      <Form.Select
                        value={testResults[test.name] || ''}
                        onChange={(e) => handleResultChange(test.name, e.target.value)}
                      >
                        <option value="">Chọn kết quả</option>
                        {test.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                ))}

                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú"
                  />
                </Form.Group>

                <Button variant="outline-secondary" className="mb-3">
                  Tải lên tài liệu đính kèm
                </Button>

                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                  >
                    Ghi nhận và gửi xác thực
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TestResultsEntry;