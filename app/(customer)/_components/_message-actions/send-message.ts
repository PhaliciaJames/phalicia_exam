// app/(customer)/_components/_message-actions/send-message.ts
"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Define the schema for message input validation
const messageSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(100, "Subject is too long"),
  content: z.string().min(1, "Message content is required").max(5000, "Message is too long")
});

// Type for the function return type
type SendMessageResult = {
  success: boolean;
  error?: string;
  messageId?: string;
};

export async function sendMessage(
  data: z.infer<typeof messageSchema>
): Promise<SendMessageResult> {
  try {
    // Validate the input data
    const validatedData = messageSchema.parse(data);

    // Get the current authenticated user
    const { user } = await validateRequest();

    if (!user) {
      return {
        success: false,
        error: "You must be logged in to send a message"
      };
    }

    // Create the message in the database
    const message = await db.message.create({
      data: {
        subject: validatedData.subject,
        content: validatedData.content,
        fromUserId: user.id,
        isFromAdmin: false,
        status: "UNREAD" // Default status
      }
    });

    return {
      success: true,
      messageId: message.id
    };
  } catch (error) {
    console.error("Error sending message:", error);

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
      error: "Failed to send message. Please try again later."
    };
  }
}