import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';

const StaffLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="staff-app vh-100">
      {/* Fixed Staff Header */}
      <Navbar variant="dark" className="px-3 fixed-top shadow staff-header" style={{ zIndex: 1030 }}>
        <Navbar.Brand>
          <strong>Bloodline DNA Testing - Staff Portal</strong>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Nav>
      </Navbar>

      <Container fluid className="h-100" style={{ paddingTop: '56px' }}>
        <Row className="h-100">
          {/* Fixed Sidebar */}
          <Col md={3} lg={2} className="p-0 position-fixed h-100" style={{ 
            top: '56px', 
            backgroundColor: '#f8f9fa', 
            borderRight: '1px solid #dee2e6',
            zIndex: 1020
          }}>
            <div className="staff-sidebar p-3 h-100 overflow-auto">
              <Nav className="flex-column">
                <Nav.Link 
                  as={NavLink} 
                  to="/staff" 
                  end 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  📊 Tổng quan
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/ketqua-xetnghiem" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  🧪 Nhập kết quả xét nghiệm
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/tuvan-khachhang" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  💬 Xử lý yêu cầu tư vấn
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/congviec-phancong" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  📋 Công việc được phân công
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/phanhoi-khachhang" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  📝 Phản hồi khách hàng
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/mau-laytainha" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  🏠 Tiếp nhận mẫu lấy tại nhà
                </Nav.Link>
                <Nav.Link 
                  as={NavLink} 
                  to="/staff/bienban-laymau" 
                  className="mb-2 rounded px-3 py-2 text-decoration-none staff-nav-link"
                  style={{ color: '#495057' }}
                >
                  📄 Biên bản lấy mẫu tại cơ sở
                </Nav.Link>
              </Nav>
            </div>
          </Col>
          
          {/* Main Content with offset for fixed sidebar */}
          <Col md={9} lg={10} className="ms-auto p-0" style={{ backgroundColor: '#ffffff' }}>
            <main className="staff-content p-4 h-100 overflow-auto">
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
   
        .staff-header {
            background-color: #6896db;
            color: white;
        }
        .staff-nav-link.active {
          background-color: #6896db !important;
          color: white !important;
        }
        .staff-nav-link {
          transition: all 0.2s ease-in-out;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .staff-sidebar {
            position: static !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffLayout;