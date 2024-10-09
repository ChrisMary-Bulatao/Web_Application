import { useState } from 'react';
import { Nav, Container } from 'react-bootstrap';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>MyApp</h3>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <Nav className="flex-column">
          <Nav.Link href="/insert" onClick={() => setSidebarOpen(false)}>Insert Position</Nav.Link>
          <Nav.Link href="/get" onClick={() => setSidebarOpen(false)}>Position List</Nav.Link>
          <Nav.Link href="/upload" onClick={() => setSidebarOpen(false)}>Upload File</Nav.Link>
        </Nav>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <Nav className="navbar bg-light shadow-sm">
          <Nav.Item>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
          </Nav.Item>
        </Nav>

        <Container className="d-flex flex-column align-items-center mt-4">
          <div className="content">
            {children}
          </div>
        </Container>
      </div>

      <style jsx>{`
        .app-container {
          display: flex;
          height: 100vh;
          position: relative;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 250px;
          height: 100%;
          position: fixed;
          top: 0;
          left: -250px;
          background-color: #343a40;
          color: #fff;
          transition: left 0.3s ease;
          z-index: 1000;
          padding: 20px;
        }

        .sidebar.active {
          left: 0;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #fff;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #fff;
        }

        .sidebar a {
          color: #fff;
          margin: 10px 0;
        }

        /* Content Area Styling */
        .content-area {
          flex-grow: 1;
          padding-left: 0;
          margin-left: 0;
          width: 100%;
          transition: margin-left 0.3s ease;
        }

        .sidebar-open .content-area {
          margin-left: 250px;
        }

        .menu-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #343a40;
        }

        .navbar {
          width: 100%;
          padding: 10px 20px;
          background-color: #f8f9fa;
        }

        /* Ensure content is aligned towards the top */
        .content {
          margin-top: 20px; /* Adjust this value as needed */
          width: 100%;
          max-width: 600px;
        }

        .mt-4 {
          margin-top: 10px !important;
        }

        /* General Text and Font Color */
        h3 {
          color: #4A90E2;
        }

        a.nav-link {
          color: #fff;
        }

        a.nav-link:hover {
          color: #ddd;
        }
      `}</style>
    </div>
  );
}
