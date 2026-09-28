import { NextResponse } from "next/server";

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabaseAdmin = getAdminClient();
    const { data: announcements, error } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, link, type, sendEmail } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    // 1. Save to Database using Admin Client
    const { data: newAnnouncement, error: dbError } = await supabaseAdmin
      .from('announcements')
      .insert([{
        title,
        content,
        type: type || 'info',
        link,
        is_active: true
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Broadcast Email if requested
    if (sendEmail) {
      const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      if (!authError && users) {
        const emails = users.map((u: any) => u.email).filter(Boolean);
        const resendApiKey = process.env.RESEND_API_KEY;

        if (resendApiKey && emails.length > 0) {
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
        }
      }
    }

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, link, type } = await request.json();
    if (!id || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();
    const { data: updatedAnnouncement, error } = await supabaseAdmin
      .from('announcements')
      .update({ title, content, link, type })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, announcement: updatedAnnouncement });
  } catch (error: any) {
    console.error("Update announcement error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();
    const { error } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
