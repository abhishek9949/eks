import { openDb } from "@/lib/sqlite";
import { initDB } from "@/lib/initDB";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const accountData = body.accountData;
    const current_account = body.currentAccount ?? [];
    const accessToken = body.accessToken;
    const uniqueId = body.uniqueId;
    const permissionsJson = JSON.stringify(accountData.permissions);
    const accountJson = JSON.stringify(current_account);

    await initDB();
    const db = openDb();

    // Store user
    const user = accountData.user_info;
    db.prepare(
      `INSERT INTO user_cookie (email, full_name, profile, organization_id, unique_id, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      user.email,
      user.full_name,
      user.profile,
      user.organization_id,
      uniqueId,
      user.id,
    );

    // Store permissions
    db.prepare(
      `INSERT INTO permission_cookie (unique_id, permissions_json)
       VALUES (?, ?)`,
    ).run(uniqueId, permissionsJson);

    // Store role
    const role = accountData.role;
    db.prepare(
      `INSERT INTO current_role_cookie (role_id, role_name, unique_id)
       VALUES (?, ?, ?)`,
    ).run(role.role_id, role.role_name, uniqueId);

    // Store current account
    if (current_account?.length > 0) {
      db.prepare(
        `INSERT INTO current_account_cookie (unique_id, accounts_json)
         VALUES (?, ?)`,
      ).run(uniqueId, accountJson);
    }

    // Store token
    db.prepare(
      `INSERT INTO token_cookie (token, unique_id)
       VALUES (?, ?)`,
    ).run(accessToken, uniqueId);

    return new Response(JSON.stringify({ message: "Data stored in SQLite" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error storing cookie data:", error);
    return new Response(JSON.stringify({ error: "Failed to store data" }), {
      status: 500,
    });
  }
}
