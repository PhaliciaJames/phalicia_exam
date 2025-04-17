// app/(customer)/_components/_message-actions/fetch-message.ts
"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";

type FetchMessagesResult = {
  success: boolean;
  messages?: any[];
  error?: string;
};

export async function fetchCustomerMessages(): Promise<FetchMessagesResult> {
  try {
    // Get the current authenticated user
    const { user } = await validateRequest();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to view messages"
      };
    }

    // Fetch all messages related to this user
    const messages = await db.message.findMany({
      where: {
        OR: [
          { fromUserId: user.id }, // Messages sent by the user
          { toUserId: user.id }    // Messages sent to the user
        ]
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      }
    });

    // Map the messages to a simpler structure
    const formattedMessages = messages.map(message => ({
      id: message.id,
      subject: message.subject,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isRead: message.status === "READ",
      isFromAdmin: message.isFromAdmin
    }));

    return {
      success: true,
      messages: formattedMessages
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: "Failed to load messages. Please try again later."
    };
  }
}