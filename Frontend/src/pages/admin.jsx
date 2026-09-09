import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,faGauge,  } from '@fortawesome/free-solid-svg-icons';
import { FaPlus, FaEye, FaFilter,FaEdit} from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx"
import TopBar from "../components/TopBar.jsx"
import Metrics from "../components/Metrics.jsx"
import '../App.css'

function QuickActions() {
  return (
    <section className="quick-actions">
      <h2 className="quick-actions-title">
        Quick Administrative Actions
      </h2>
      <div className="buttons-row">
        <button className="btn-add-product">
          <FaPlus className="quick-action-icon" />
          <span>Add Product</span>
        </button>
        <button className="btn-add-service">
          <FaPlus className="quick-action-icon" />
          <span>Add Service</span>
        </button>
        <button className="btn-view-requests">
          <FaEye className="quick-action-eye" />
          <span>View Pending Requests</span>
        </button>
      </div>
    </section>
  );
}

function RecentInquiries() {
  const inquiries = [
    {
      id: "#REQ-0489",
      customer: "Al-Fatah Tech Ltd",
      type: "Product",
      item: "Cisco Catalyst 9300 Network Switch",
      qty: 4,
      status: "New",
      date: "Oct 24, 2026",
    },
    {
      id: "#REQ-0488",
      customer: "Tech Solutions",
      type: "Product",
      item: "Dell PowerEdge Server",
      qty: 2,
      status: "New",
      date: "Oct 23, 2026",
    },
    {
      id: "#REQ-0487",
      customer: "Mifra Systems",
      type: "Service",
      item: "Network Installation",
      qty: 1,
      status: "New",
      date: "Oct 22, 2026",
    },
    {
      id: "#REQ-0486",
      customer: "Global IT Services",
      type: "Product",
      item: "HP LaserJet Pro Printer",
      qty: 3,
      status: "New",
      date: "Oct 21, 2026",
    },
    {
      id: "#REQ-0485",
      customer: "Digital World",
      type: "Service",
      item: "IT Support & Maintenance",
      qty: 1,
      status: "New",
      date: "Oct 20, 2026",
    },
    {
      id: "#REQ-0484",
      customer: "Al Noor Enterprises",
      type: "Product",
      item: "TP-Link Network Router",
      qty: 5,
      status: "New",
      date: "Oct 19, 2026",
    },
  ];

  return (
    <section className="table-container">
      <div className="table-header-title-bar">
        <h2>Recent Customer Inquiries</h2>
        <button className="btn-filter">
          <FaFilter />
          <span>Filter</span>
        </button>
      </div>
      <div className="inquiries-table-wrapper">
        <table className="inquiries-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer Name</th>
              <th>Type</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>{inquiry.customer}</td>
                <td>{inquiry.type}</td>
                <td>{inquiry.item}</td>
                <td className="qty-cell">
                  {inquiry.qty}
                </td>
                <td>
                  <span className="status-badge">
                    {inquiry.status}
                  </span>
                </td>
                <td>{inquiry.date}</td>
                <td>
                  <div className="inquiry-actions">
                    <button className="inquiry-action-btn">
                      <FaEdit />
                    </button>
                    <button className="inquiry-action-btn">
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}



function Admin() {
	return(
      <div className="container">
          <Sidebar/>
      	<div className="main-section">
      		<TopBar/>
          <section className="scroll-content">
            <Metrics/>
            <QuickActions/>
            <RecentInquiries/>
          </section>
      	</div>
      </div>
	)
}
export default Admin

