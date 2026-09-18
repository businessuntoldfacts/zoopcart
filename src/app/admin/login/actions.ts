"use server";

import { cookies } from "next/headers";

const ADMIN_EMAIL = "admin@zoopcart.com";
const ADMIN_PASS = "Zoopcart@Admin2026";
const SECRET_TOKEN = "zoopcart_secure_master_key_2026";

export async function loginAdmin(email: string, pass: string) {
  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    cookies().set("zoopcart_admin_token", SECRET_TOKEN, {
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
  cookies().delete("zoopcart_admin_token");
}
