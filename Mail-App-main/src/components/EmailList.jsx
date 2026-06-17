import React from "react";
import img from "../assets/img1.jpg";
import { MdArchive, MdDelete, MdStarBorder } from "react-icons/md";

const EmailList = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  onDelete,
  onStar,
  onArchive,
  selectedIds = new Set(),
  onToggleSelect,
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto "
      style={{ background: "#E9F4FF" }}
    >
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] text-gray-400">
          <span className="text-5xl mb-4">📭</span>
          <p>Your folder is empty</p>
        </div>
      ) : (
        <div className="flex flex-col ">
          {emails.map((email) => (
            <div
              key={email.uid}
              onClick={() => onSelectEmail(email)}
              className={`group relative flex items-center gap-6
                cursor-pointer py-3 
                bg-gray-100 border px-5
                transition-all duration-300 ease-out
                ${selectedEmailId === email.uid
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                }`}
            >



              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={img}
                  alt={email.from}
                  className="h-11 w-11 rounded-full object-cover bg-gray-100"
                />
                {!email.isRead && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                    <span className="block h-2.5 w-2.5 rounded-full bg-blue-600" />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`truncate text-sm ${!email.isRead
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-700"
                      }`}
                  >
                    {email.from}
                  </p>
                  <span className="text-xs text-gray-400">
                    {email.receivedDate
                      ? new Date(email.receivedDate).toLocaleDateString()
                      : ""}

                  </span>
                </div>

                <p
                  className={`truncate text-sm ${!email.isRead
                    ? "font-medium text-gray-900"
                    : "text-gray-600"
                    }`}
                >
                  {email.subject}
                </p>
              </div>

              {/* Star */}
              {email.starred && (
                <MdStarBorder size={20} className="text-yellow-500" />
              )}

              {/* Hover Actions */}
              <div
                className="absolute top-1/2 -translate-y-1/2
             right-20
             flex items-center gap-2 rounded-xl
             bg-white p-1 shadow-lg opacity-0 scale-95
             transition-all duration-200 group-hover:opacity-100 group-hover:scale-100"
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(email.uid);
                  }}
                  className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-600"
                >
                  <MdArchive size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(email.uid);
                  }}
                  className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-600"
                >
                  <MdDelete size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStar?.(email.uid);
                  }}
                  className="rounded-lg p-1.5 hover:bg-gray-100 text-gray-600"
                >
                  <MdStarBorder size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
