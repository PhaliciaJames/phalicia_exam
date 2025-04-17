// app/(customer)/_components/MessageModal.tsx
"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "@/app/SessionProvider";
import { sendMessage } from "./_message-actions/send-message";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Please provide both subject and message");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sendMessage({
        subject: subject.trim(),
        content: message.trim(),
      });
      
      if (result.success) {
        toast.success("Message sent successfully");
        setSubject("");
        setMessage("");
        onClose();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-teal-500 text-white">
          <h2 className="text-xl font-semibold">Contact Admin</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-teal-200 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Message subject"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-32"
              placeholder="Type your message here..."
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center disabled:bg-teal-300 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Send size={18} className="mr-2" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}