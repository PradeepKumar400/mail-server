import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mailAPI } from "../services/api";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Inbox = ({ emails = [], searchQuery, onDelete, onStar, onArchive }) => {
  console.log("nandhini",emails)
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [selectedEmail, setSelectedEmail] = useState(null);

  // Filter emails locally based on prop and search query
  const visibleEmails = emails.filter(
    (e) =>
      e.folder === "inbox" &&
      (e.subject?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        e.from?.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        e.senderEmail?.toLowerCase().includes((searchQuery || "").toLowerCase()))
  );

  // Reset selected email on route change
  useEffect(() => {
    setSelectedEmail(null);
  }, [location.pathname]);

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);

    // Attempt to mark as read on server
    if (!email.isRead) {
      mailAPI.markRead(email.uid).catch(console.error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div
        className={`${selectedEmail ? "hidden lg:block lg:w-2/5" : "w-full"} border-r`}
        style={{ backgroundColor: theme.bg }}
      >
        <EmailList
          emails={visibleEmails}
          selectedEmailId={selectedEmail?.uid}
          onSelectEmail={handleSelectEmail}
          onDelete={onDelete}
          onStar={onStar}
          onArchive={onArchive}
        />
      </div>

      <div className={`flex-1 ${selectedEmail ? "block" : "hidden lg:block"}`}>
        <EmailDetails
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
          onDelete={(uid) => {
            onDelete(uid);
            setSelectedEmail(null);
          }}
          onStar={onStar}
          onArchive={(uid) => {
            onArchive(uid);
            setSelectedEmail(null);
          }}
          onReply={(email) =>
            navigate("/compose", {
              state: {
                replyTo: email.from,
                subject: `Re: ${email.subject}`,
                originalBody: email.body,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default Inbox;
