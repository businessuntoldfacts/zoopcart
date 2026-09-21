import { NextResponse } from "next/server";
import { getWelcomeEmailTemplate, getOrderNotificationEmailTemplate, getSellerOrderNotificationEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, ...data } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY environment variable is missing. Logging email instead.");
      console.log(`Email Type: ${type}, To: ${email}, Data:`, data);
      return NextResponse.json({ success: true, message: "Email simulated successfully (missing API key)" });
    }

    let html = "";
    let subject = "";

    if (type === "welcome") {
      const { fullName, businessName, storeUrl } = data;
      html = getWelcomeEmailTemplate(fullName, businessName, storeUrl);
      subject = `Welcome to Zoopcart, ${fullName}! 🚀`;
    } else if (type === "order_notification") {
      html = getOrderNotificationEmailTemplate(data);
      subject = `Order Update: ${data.productName} - Zoopcart`;
    } else if (type === "seller_order_notification") {
      html = getSellerOrderNotificationEmailTemplate(data);
      subject = `New Order Received! 🛍️ #${data.orderId}`;
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Zoopcart <orders@zoopcart.com>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json({ error: "Failed to send email via Resend" }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error in send email API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
