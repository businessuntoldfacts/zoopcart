"use server";

import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@zypcart.com";
const ADMIN_PASS = "Zypcart@Admin2026";
const SECRET_TOKEN = "zypcart_secure_master_key_2026";

export async function loginAdmin(email: string, pass: string) {
  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    cookies().set("zypcart_admin_token", SECRET_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid admin credentials" };
}

export async function logoutAdmin() {
  cookies().delete("zypcart_admin_token");
}
