"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";


type FetchMessagesParams = {
  status?: "READ" | "UNREAD" | "REPLIED";
  search?: string;
};

type FetchMessagesResult = {
  success: boolean;
  messages?: any[];
  error?: string;
};

export async function fetchAllMessages(
  filters: FetchMessagesParams = {}
): Promise<FetchMessagesResult> {
  try {
    // Get the current authenticated user
    const { user } = await validateRequest();
    
    if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
      return {
        success: false,
        error: "You don't have permission to access these messages"
      };
    }
    
    // Build the where clause based on filters
    const where: any = {};
    
    // Add status filter if provided
    if (filters.status) {
      where.status = filters.status;
    }
    
    // Add search filter if provided
    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    // Fetch all messages with user information
    const messages = await db.message.findMany({
      where,
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      include: {
        fromUser: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });
    
    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: "Failed to load messages. Please try again later."
    };
  }
}