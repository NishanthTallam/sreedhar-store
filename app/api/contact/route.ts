import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);
    
    // Save to database
    const enquiry = await prisma.contactEnquiry.create({
      data: validatedData
    });
    
    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully", data: enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CONTACT_API]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: (error as any).errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
