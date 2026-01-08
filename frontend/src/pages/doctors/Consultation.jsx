
export default function Consultation() {
  return (
    <div className="consultation-layout">

      {/* VIDEO SECTION */}
      <div className="video-section">

        <div className="video-header">
          <h3>Live Consultation</h3>
          <span className="timer">00:18:42</span>
        </div>

        <div className="video-grid">
          <div className="video-box doctor-video">
            <p>Doctor Camera</p>
          </div>

          <div className="video-box patient-video">
            <p>Patient Camera</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="call-controls">
          <button className="control-btn">🎥 Video</button>
          <button className="control-btn">🎤 Mic</button>
          <button className="control-btn">🖥 Share Screen</button>
          <button className="control-btn record">⏺ Record</button>
          <button className="control-btn end-call">End Call</button>
        </div>

      </div>

      {/* SIDE PANEL */}
      <aside className="consultation-sidebar">

        <div className="tab-header">
          <button className="active">Notes</button>
          <button>Chat</button>
        </div>

        {/* NOTES */}
        <div className="notes-panel">
          <textarea placeholder="Write consultation notes here..."></textarea>
          <button className="primary-btn">Save Notes</button>
        </div>

        {/* CHAT (UI only) */}
        <div className="chat-panel">
          <div className="chat-messages">
            <p><strong>Patient:</strong> I feel pain in my shoulder</p>
            <p><strong>Doctor:</strong> Please move your arm slowly</p>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Type message..." />
            <button>Send</button>
          </div>
        </div>

      </aside>

    </div>
  );
}
