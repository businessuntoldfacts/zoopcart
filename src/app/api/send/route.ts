import { NextResponse } from "next/server";
import { getWelcomeEmailTemplate, getOrderNotificationEmailTemplate, getSellerOrderNotificationEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, ...data } = body;

    console.log("Email Request Received:", { type, email });

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("CRITICAL: RESEND_API_KEY is missing in environment variables.");
      return NextResponse.json({
        error: "Email configuration missing (RESEND_API_KEY)",
        debug: "Please add RESEND_API_KEY to your environment variables."
      }, { status: 500 });
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

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error detail:", JSON.stringify(result));
      return NextResponse.json({
        error: "Resend API Error",
        detail: result
      }, { status: response.status });
    }

    console.log("Email sent successfully:", result.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error in send email API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
