// app/(customer)/_components/CustomerMessages.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Mail, Send, RefreshCw, MessageCircle } from "lucide-react";
import { fetchCustomerMessages } from "./_message-actions/fetch-message";
import MessageModal from "./MessageModal";

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  isFromAdmin: boolean;
}

export default function CustomerMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Function to load messages
  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await fetchCustomerMessages();

      if (result.success && result.messages) {
        setMessages(result.messages);
      } else {
        toast.error(result.error || "Failed to load messages");
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("An error occurred while loading messages");
    } finally {
      setLoading(false);
    }
  };

  // Load messages on initial render
  useEffect(() => {
    loadMessages();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Mail className="mr-2" /> My Messages
        </h1>

        <div className="flex gap-2">
          <button 
            onClick={loadMessages}
            className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition"
            aria-label="Refresh messages"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          <button
            onClick={toggleModal}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center"
          >
            <Send size={18} className="mr-2" />
            New Message
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-teal-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <MessageCircle size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">No messages yet</h3>
          <p className="text-gray-600">
            You don&apos;t have any messages. Send a message to support.
          </p>
          <button
            onClick={toggleModal}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
          >
            Contact Support
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`py-4 ${!message.isRead && !message.isFromAdmin ? "bg-blue-50" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    {!message.isRead && !message.isFromAdmin && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" aria-label="Unread"></span>
                    )}
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {message.isFromAdmin ? "From: Admin" : "From: You"} • {format(new Date(message.createdAt), "PPP p")}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${message.isFromAdmin ? "bg-purple-100 text-purple-800" : "bg-teal-100 text-teal-800"}`}>
                    {message.isFromAdmin ? "Admin" : "Sent"}
                  </span>
                </div>
              </div>
              
              <p className="mt-2 text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Message Modal for sending new messages */}
      <MessageModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        loadMessages(); // Refresh messages after closing modal
      }} />
    </div>
  );
}