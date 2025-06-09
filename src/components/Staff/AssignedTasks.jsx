import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Badge, InputGroup } from 'react-bootstrap';

const AssignedTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [typeFilter, setTypeFilter] = useState('Tất cả');

  const mockTasks = [
    {
      id: 'TASK001',
      type: 'Tư vấn',
      description: 'Tư vấn cho khách hàng về quy trình xét nghiệm',
      customer: 'Nguyễn Văn A',
      status: 'Chờ xử lý',
      dueDate: '20/12/2024',
      assignedBy: 'Quản lý Phạm B'
    },
    {
      id: 'TASK002',
      type: 'Xét nghiệm',
      description: 'Xử lý mẫu xét nghiệm ADN',
      customer: 'Trần Thị C',
      status: 'Đang xử lý',
      dueDate: '18/12/2024',
      assignedBy: 'Quản lý Lê D'
    },
    {
      id: 'TASK003',
      type: 'Xét nghiệm',
      description: 'Nhập kết quả xét nghiệm máu',
      customer: 'Hoàng Văn E',
      status: 'Quá hạn',
      dueDate: '10/12/2024',
      assignedBy: 'Quản lý Phạm B'
    }
  ];

  const getStatusVariant = (status) => {
    const statusVariants = {
      'Chờ xử lý': 'warning',
      'Đang xử lý': 'primary',
      'Hoàn thành': 'success',
      'Quá hạn': 'danger'
    };
    return statusVariants[status] || 'secondary';
  };

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tất cả' || task.status === statusFilter;
    const matchesType = typeFilter === 'Tất cả' || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Container fluid className="assigned-tasks py-4">
      <Row>
        <Col>
          <h1 className="mb-4">Danh sách công việc được phân công</h1>
          
          <Row className="mb-4">
            <Col md={4}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo ID hoặc tên khách hàng"
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
                <option>Chờ xử lý</option>
                <option>Đang xử lý</option>
                <option>Hoàn thành</option>
                <option>Quá hạn</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Yêu cầu tư vấn</option>
                <option>Mẫu xét nghiệm</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Không có công việc nào được tìm thấy.</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>ID Công việc</th>
                  <th>Loại</th>
                  <th>Mô tả/Tiêu đề</th>
                  <th>Khách hàng</th>
                  <th>Trạng thái</th>
                  <th>Hạn xử lý</th>
                  <th>Được phân công bởi</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td><strong>{task.id}</strong></td>
                    <td>{task.type}</td>
                    <td>{task.description}</td>
                    <td>{task.customer}</td>
                    <td>
                      <Badge bg={getStatusVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </td>
                    <td>{task.dueDate}</td>
                    <td>{task.assignedBy}</td>
                    <td>
                      <Button variant="outline-primary" size="sm">
                        👁️ Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AssignedTasks;