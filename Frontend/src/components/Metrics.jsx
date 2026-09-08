import '../App.css'
function BoxIcon() {
  return (
    <svg className="metric-icon" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6.5L10 3L17 6.5V14L10 17L3 14V6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 6.5L10 10L16.5 6.5M10 10V17"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="metric-icon" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3L17 16H3L10 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.5V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg className="metric-icon" viewBox="0 0 20 20" fill="none">
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg className="metric-icon" viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 7H13.5M6.5 10H13.5M6.5 13H11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ServiceIcon() {
  return (
    <svg className="metric-icon" viewBox="0 0 20 20" fill="none">
      <circle
        cx="10"
        cy="10"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 6.5V10L12.5 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({ title, value, icon, isLoading }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">
          {title}
        </span>
        <div className="metric-icon-box">
          {icon}
        </div>
      </div>
      <div className={`metric-value ${isLoading ? "metric-skeleton" : ""}`}>{isLoading ? "" : value}</div>
    </div>
  );
}


function Metrics({ metrics, isLoading }) {
	const values = metrics || {};
	return(
      <div className="metrics-grid">
        <div className="metrics-row">
          <MetricCard
            title="Total Active Products"
            value={values.totalActiveProducts}
            isLoading={isLoading}
            icon={<BoxIcon />}
          />
          <MetricCard
            title="In-Stock Products"
            value={values.inStockProducts}
            isLoading={isLoading}
            icon={<BoxIcon />}
          />
          <MetricCard
            title="Low Stock Alert"
            value={values.lowStockProducts}
            isLoading={isLoading}
            icon={<AlertIcon />}
          />
        </div>
        <div className="metrics-row">
          <MetricCard
            title="Out of Stock Products"
            value={values.outOfStockProducts}
            isLoading={isLoading}
            icon={<XCircleIcon />}
          />
          <MetricCard
            title="Pending Product Inquiries"
            value={values.pendingProductRequests}
            isLoading={isLoading}
            icon={<InquiryIcon />}
          />
          <MetricCard
            title="Pending Service Inquiries"
            value={values.pendingServiceRequests}
            isLoading={isLoading}
            icon={<ServiceIcon />}
          />
        </div>
      </div>


	)
}
export default Metrics
