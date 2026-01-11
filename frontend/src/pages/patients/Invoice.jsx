import SidebarPat from "./components/SidebarPat";

export default function Invoice() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
            <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Invoice</h1>
          <p>Consultation billing summary</p>
        </div>

        {/* INVOICE CARD */}
        <div className="record-card invoice-card">

          <div className="invoice-header">
            <h3>Invoice #INV-00123</h3>
            <span className="badge paid">✓ Paid</span>
          </div>

          <div className="invoice-details">
            <div className="info-row">
              <span>Date</span>
              <strong>10-Jan-2026</strong>
            </div>

            <div className="info-row">
              <span>Doctor</span>
              <strong>Dr. Ahmed Khan</strong>
            </div>

            <div className="info-row">
              <span>Consultation</span>
              <strong>Video (30 mins)</strong>
            </div>

            <div className="info-row amount">
              <span>Total Amount</span>
              <strong>PKR 1000</strong>
            </div>
          </div>

          <div className="invoice-actions">
            <button className="primary-btn">Download PDF</button>
            <button className="btn-outline">View Receipt</button>
          </div>

        </div>

      </main>
    </div>
  );
}
