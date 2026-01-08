
export default function Messages() {
  return (
    <div className="messages-layout">

      {/* INBOX */}
      <aside className="inbox">
        <h3>Inbox</h3>

        <div className="conversation active">
          <h4>Ahmed Khan</h4>
          <p>Sir kal dawai start kar doon?</p>
          <span className="unread"></span>
        </div>

        <div className="conversation">
          <h4>Sara Ali</h4>
          <p>Report upload ho gayi</p>
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="chat-area">

        {/* CHAT HEADER */}
        <div className="chat-header">
          <h3>Ahmed Khan</h3>
          <button className="important-btn">★ Important</button>
        </div>

        {/* CHAT MESSAGES */}
        <div className="chat-messages">
          <div className="message received">
            Sir kal dawai start kar doon?
          </div>

          <div className="message sent">
            Haan ji, kal subah start kar dein.
          </div>
        </div>

        {/* QUICK REPLIES */}
        <div className="quick-replies">
          <button>Haan ji</button>
          <button>Kal appointment hai</button>
          <button>Report bhejein</button>
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
          <input type="file" id="fileUpload" hidden />
          <label htmlFor="fileUpload" className="file-btn">📎</label>
          <button className="send-btn">Send</button>
        </div>

      </main>

    </div>
  );
}
