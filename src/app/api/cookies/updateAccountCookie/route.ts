import { openDb } from "@/lib/sqlite";
import { initDB } from "@/lib/initDB";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accountData, uniqueId } = body;

    if (!accountData?.length || !uniqueId) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
      });
    }

    await initDB();
    const db = await openDb();

    db.prepare(
      `INSERT INTO current_account_cookie (unique_id, accounts_json)
       VALUES (?, ?)
       ON CONFLICT(unique_id) DO UPDATE SET accounts_json=excluded.accounts_json`,
    ).run(uniqueId, JSON.stringify(accountData));
    return new Response(
      JSON.stringify({ message: "Accounts updated successfully" }),
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error("Failed to update accounts:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
