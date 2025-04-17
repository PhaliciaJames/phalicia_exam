"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Mail, RefreshCw, Reply, Search, Filter, MessageCircle } from "lucide-react";
import { Select } from "@/components/ui/select";
import { fetchAllMessages } from "./message_actions/fetch-admin-messages";
import { replyToMessage } from "./message_actions/reply-message";

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: "READ" | "UNREAD" | "REPLIED";
  fromUser: {
    id: string;
    username: string;
    displayName?: string;
  };
  isFromAdmin: boolean;
}

export default function AdminMessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "READ" | "UNREAD" | "REPLIED">("ALL");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  
  // Function to load messages
  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await fetchAllMessages({
        status: filterStatus === "ALL" ? undefined : filterStatus,
        search: searchTerm || undefined
      });
      
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
  
  // Load messages on initial render and when filters change
  useEffect(() => {
    loadMessages();
  }, [filterStatus]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMessages();
  };
  
  const handleReply = async () => {
    if (!replyingTo || !replyContent.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    
    setSendingReply(true);
    try {
      const result = await replyToMessage({
        userId: replyingTo.fromUser.id,
        replyToMessageId: replyingTo.id,
        content: replyContent.trim(),
        subject: `Re: ${replyingTo.subject}`
      });
      
      if (result.success) {
        toast.success("Reply sent successfully");
        setReplyingTo(null);
        setReplyContent("");
        loadMessages(); // Refresh the message list
      } else {
        throw new Error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };
  
  // Get formatted display name
  const getDisplayName = (message: Message) => {
    return message.fromUser.displayName || message.fromUser.username;
  };
  
  // Filter messages for display
  const filteredMessages = messages;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Mail className="mr-2" /> Customer Messages
        </h1>
        
        <button 
          onClick={loadMessages}
          className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 transition"
          aria-label="Refresh messages"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </form>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Messages</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
          </Select>
        </div>
      </div>
      
      {/* Message Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-teal-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <MessageCircle size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-800">No messages found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search filters" : "No customer messages at this time"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((message) => (
            <div 
              key={message.id} 
              className={`border rounded-lg overflow-hidden ${message.status === "UNREAD" && !message.isFromAdmin ? "border-teal-500" : "border-gray-200"}`}
            >
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {message.status === "UNREAD" && !message.isFromAdmin && (
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-2" aria-label="Unread"></span>
                      )}
                      {message.subject}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {message.isFromAdmin ? "Admin" : getDisplayName(message)} • {format(new Date(message.createdAt), "PPP p")}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${message.status === "UNREAD" ? "bg-yellow-100 text-yellow-800" : 
                        message.status === "REPLIED" ? "bg-green-100 text-green-800" : 
                        "bg-blue-100 text-blue-800"}`}
                    >
                      {message.status}
                    </span>
                    
                    {!message.isFromAdmin && message.status !== "REPLIED" && (
                      <button
                        onClick={() => setReplyingTo(message)}
                        className="p-1 bg-teal-100 rounded-full text-teal-700 hover:bg-teal-200 transition"
                        aria-label="Reply"
                      >
                        <Reply size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-700">{message.content}</p>
              </div>
              
              {replyingTo?.id === message.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Reply to {getDisplayName(message)}</h4>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-32 mb-3"
                    placeholder="Type your reply here..."
                    rows={4}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center disabled:bg-teal-300 disabled:cursor-not-allowed"
                      disabled={sendingReply || !replyContent.trim()}
                    >
                      <Reply size={16} className="mr-1" />
                      {sendingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}