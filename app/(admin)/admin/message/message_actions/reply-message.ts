"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define the schema for reply validation
const replySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  replyToMessageId: z.string().min(1, "Original message ID is required"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject is too long"),
  content: z.string().min(1, "Reply content is required").max(5000, "Reply is too long")
});

// Type for the function return
type ReplyMessageResult = {
  success: boolean;
  error?: string;
  messageId?: string;
};

export async function replyToMessage(
  data: z.infer<typeof replySchema>
): Promise<ReplyMessageResult> {
  try {
    // Validate the input data
    const validatedData = replySchema.parse(data);
    
    // Get the current authenticated user
    const { user } = await validateRequest();
    
    if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
      return {
        success: false,
        error: "You don't have permission to reply as admin"
      };
    }
    
    // Update the original message status to REPLIED
    await db.message.update({
      where: {
        id: validatedData.replyToMessageId
      },
      data: {
        status: "REPLIED"
      }
    });
    
    // Create the reply message
    const message = await db.message.create({
      data: {
        subject: validatedData.subject,
        content: validatedData.content,
        fromUserId: user.id,
        toUserId: validatedData.userId,
        isFromAdmin: true,
        status: "UNREAD" // Default status for the customer to read
      }
    });
    
    return {
      success: true,
      messageId: message.id
    };
  } catch (error) {
    console.error("Error replying to message:", error);
    
    if (error instanceof z.ZodError) {
      // Format validation errors
      const errorMessage = error.errors.map(err => err.message).join(", ");
      return {
        success: false,
        error: errorMessage
      };
    }
    
    return {
      success: false,
      error: "Failed to send reply. Please try again later."
    };
  }
}