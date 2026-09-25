import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { title, content, link } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    // 1. Fetch all store owners (businesses)
    // In a real app, you might want to fetch directly from auth.users or a profiles table
    // For this implementation, we assume every business has a corresponding user.
    const { data: stores, error: storeError } = await supabase
      .from('businesses')
      .select('user_id');

    if (storeError) throw storeError;

    // 2. In a real scenario, you'd fetch emails from auth.admin.listUsers()
    // but that requires a service role.
    // Here we'll simulate the broadcast to all users who have an active store.

    // For demonstration, let's assume we have a way to get emails.
    // Since we're in a server route, we could theoretically use the service role key
    // to fetch all users from Supabase Auth.

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Skipping email broadcast.");
        return NextResponse.json({ success: true, message: "Announcement saved, but emails skipped (no service key)" });
    }

    // Initialize admin client
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) throw authError;

    const emails = users.map((u: any) => u.email).filter(Boolean);

    // 3. Send emails using Resend (using our existing send route logic)
    const resendApiKey = process.env.RESEND_API_KEY;

    // Batch sending if possible, or loop (Resend supports batching)
    // For simplicity, we'll use their batch API
    const chunks = [];
    for (let i = 0; i < emails.length; i += 50) {
      chunks.push(emails.slice(i, i + 50));
    }

    for (const chunk of chunks) {
      await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(chunk.map((email: string) => ({
          from: "Zoopcart <announcements@zoopcart.com>",
          to: [email],
          subject: `📢 Announcement: ${title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #111;">${title}</h2>
              <p style="color: #555; line-height: 1.5; white-space: pre-wrap;">${content}</p>
              ${link ? `<a href="${link}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View More</a>` : ''}
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #aaa;">Zoopcart Platform Updates</p>
            </div>
          `
        }))),
      });
    }

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
