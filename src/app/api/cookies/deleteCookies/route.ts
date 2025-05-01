import { openDb } from "@/lib/sqlite";
import { initDB } from "@/lib/initDB";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await initDB();
    const db = openDb(); // Since openDb is not async in better-sqlite3, remove `await`

    // Use db.run() for synchronous SQL queries
    db.prepare("DELETE FROM current_account_cookie").run();
    db.prepare("DELETE FROM current_role_cookie").run();
    db.prepare("DELETE FROM user_cookie").run();
    db.prepare("DELETE FROM permission_cookie").run();
    db.prepare("DELETE FROM token_cookie").run();

    const res = new NextResponse(
      JSON.stringify({ message: "Cookies deleted successfully." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const protocol = headers().get("x-forwarded-proto") ?? "http";
    const isSecure = protocol === "https";

    // List of cookies to delete
    const cookiesToDelete = ["unique_id", "parent_unique_id", "token"];

    cookiesToDelete.forEach((cookieName) => {
      res.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Immediately expire the cookie
        expires: new Date(0), // Expire the cookie
      });
    });

    return res;
  } catch (error) {
    console.error("Error deleting cookies:", error);
    return new Response(JSON.stringify({ error: "Failed to delete cookies" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
