import { NextRequest, NextResponse } from "next/server";
import { API_CONSTANTS } from "@/constants/api";
import { getDynamicHostAndPort } from "@/hooks/useUrlMiddleware";
import { AccountDataProps, Role } from "@/types/authType";
import { cookies, headers } from "next/headers";
import { getRedirectionPath } from "@/utils/permissionFormate";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const fullUrl = getDynamicHostAndPort(API_CONSTANTS.SWITCH_USER);
    const token = requestBody?.token ?? "";
    const switchEmail = requestBody?.email;
    const baseUrl = req.nextUrl.origin;

    const cookieStore = cookies();
    const existingUniqueId = cookieStore.get("unique_id")?.value ?? "";
    const parentUniqueId = cookieStore.get("parent_unique_id")?.value ?? "";

    let currentAccounts = [];

    // Fetch existing accounts
    try {
      const cookieHeader = `unique_id=${existingUniqueId}; parent_unique_id=${parentUniqueId || existingUniqueId}`;
      const response = await fetch(`${baseUrl}/api/cookies/getCookies`, {
        headers: { Cookie: cookieHeader },
      });
      const data = await response.json();
      currentAccounts = JSON.parse(
        data?.currentAccountCookie[0]?.accounts_json,
      );
    } catch {
      currentAccounts = [];
    }

    // Call external API for switching
    const externalResponse = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await externalResponse.json();

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: data ?? "Switch account failed" },
        { status: externalResponse.status },
      );
    }

    const accountData: Role = data.data;
    const redirect = getRedirectionPath(
      accountData?.permissions[0]?.permission_name ?? "",
    );

    const res = NextResponse.json({
      redirect,
      access_token: data.access_token,
      message: data.message,
    });

    // Update accounts: set only the matched one to active with new token
    const updatedAccounts = currentAccounts.map((account: AccountDataProps) => {
      if (account.email === switchEmail) {
        cookieStore.set("unique_id", account.unique_id);
        return {
          ...account,
          full_name: accountData.user_info.full_name,
          profile: accountData.user_info.profile,
          token: data.access_token,
          isActiveAccount: true,
        };
      }
      return {
        ...account,
        isActiveAccount: false,
      };
    });

    // Set updated cookies for active account
    if (data.data) {
      const protocol = headers().get("x-forwarded-proto") ?? "http";
      const isSecure = protocol === "https";
      res.cookies.set("token", data.access_token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
      });
      const cookieData = {
        accountData: updatedAccounts,
        uniqueId: parentUniqueId || existingUniqueId,
      };
      try {
        const res = await fetch(`${baseUrl}/api/cookies/updateAccountCookie`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cookieData),
        });
        if (res.ok) {
          console.log("account cookie updated successfully");
        }
      } catch {
        console.log("error");
      }
    }

    return res;
  } catch (error) {
    console.error("Switch Account Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
