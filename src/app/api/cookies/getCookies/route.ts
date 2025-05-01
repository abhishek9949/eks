import { openDb } from "@/lib/sqlite";
import { initDB } from "@/lib/initDB";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const parentUniqueId = cookieStore.get("parent_unique_id")?.value ?? "";
  const uniqueId = cookieStore.get("unique_id")?.value ?? "";
  
  await initDB();
  const db = openDb(); // no need for await here as it's synchronous

  // Use db.prepare() to create the SQL statement and then .all() or .get() to execute it
  const currentAccountCookie = db.prepare(
    "SELECT * FROM current_account_cookie WHERE unique_id = ?"
  ).all(parentUniqueId || uniqueId);

  const currentRoleCookie = db.prepare(
    "SELECT * FROM current_role_cookie WHERE unique_id = ? ORDER BY id DESC LIMIT 1"
  ).get(uniqueId);

  const userCookies = db.prepare(
    "SELECT * FROM user_cookie WHERE unique_id = ?"
  ).get(uniqueId);

  const permissionCookie = db.prepare(
    "SELECT * FROM permission_cookie WHERE unique_id = ?"
  ).get(uniqueId);

  const tokenCookie = db.prepare(
    "SELECT * FROM token_cookie WHERE unique_id = ?"
  ).get(uniqueId);

  return NextResponse.json({
    currentAccountCookie,
    currentRoleCookie,
    permissionCookie,
    userCookies,
    tokenCookie
  });
}
