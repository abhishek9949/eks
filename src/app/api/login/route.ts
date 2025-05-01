import { NextRequest, NextResponse } from "next/server";
import { API_CONSTANTS } from "@/constants/api";
import { getDynamicHostAndPort } from "@/hooks/useUrlMiddleware";
import { AccountDataProps, CookieDataProps, Role, UserInfo } from "@/types/authType";
import { getRedirectionPath } from "@/utils/permissionFormate";
import { cookies, headers } from "next/headers";
import { nanoid } from "nanoid";

async function getExistingAccounts(
  baseUrl: string,
  existingUniqueId: string,
  parentUniqueId: string,
) {
  try {
    const cookieHeader = `unique_id=${existingUniqueId}; parent_unique_id=${parentUniqueId || existingUniqueId}`;
    const response = await fetch(`${baseUrl}/api/cookies/getCookies`, {
      headers: { Cookie: cookieHeader },
    });
    const data = await response.json();
    return JSON.parse(data?.currentAccountCookie?.[0]?.accounts_json ?? "[]");
  } catch {
    return [];
  }
}

const buildNewAccount = (userData: UserInfo, token: string, uniqueId: string) => {
  return {
    email: userData.email,
    full_name: userData.full_name,
    profile: userData.profile,
    token,
    isActiveAccount: true,
    unique_id: uniqueId,
  };
};

const updateAccounts = (existingAccounts: AccountDataProps[], newAccount: AccountDataProps) => {
  const userIndex = existingAccounts.findIndex(
    (acc) => acc.email === newAccount.email,
  );
  const updatedAccounts = existingAccounts.map((acc) => ({
    ...acc,
    isActiveAccount: false,
  }));

  if (userIndex !== -1) {
    updatedAccounts[userIndex] = newAccount;
  } else {
    updatedAccounts.push(newAccount);
  }

  return updatedAccounts;
};

async function storeCookies(
  baseUrl: string,
  data: CookieDataProps,
  res: NextResponse,
  uniqueId: string,
) {
  try {
    const cookieRes = await fetch(`${baseUrl}/api/cookies/storeCookies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (cookieRes.ok) {
      const protocol = headers().get("x-forwarded-proto") ?? "http";
      const isSecure = protocol === "https";
      console.log('protocol', protocol);
      res.cookies.set("unique_id", uniqueId, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
      });
      res.cookies.set("token", data.accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
      });
    }
  } catch {
    console.log("error storing cookies");
  }
}

async function updateAccountCookie(
  baseUrl: string,
  accountData: AccountDataProps[],
  uniqueId: string,
) {
  try {
    const res = await fetch(`${baseUrl}/api/cookies/updateAccountCookie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountData, uniqueId }),
    });
    if (res.ok) console.log("account cookie updated successfully");
  } catch {
    console.log("error updating account cookie");
  }
}

export async function POST(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;
    const cookieStore = cookies();
    const requestBody = await req.json();
    const fullUrl = getDynamicHostAndPort(API_CONSTANTS.LOGIN);
    const uniqueId = nanoid(8);

    const existingUniqueId = cookieStore.get("unique_id")?.value ?? "";
    const parentUniqueId = cookieStore.get("parent_unique_id")?.value ?? ""; // to store common unique id for current account cookie

    if (existingUniqueId && !parentUniqueId) {
      const protocol = headers().get("x-forwarded-proto") ?? "http";
      const isSecure = protocol === "https";
      cookieStore.set("parent_unique_id", existingUniqueId, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "strict",
        path: "/",
      });
    }

    const existingAccounts = await getExistingAccounts(
      baseUrl,
      existingUniqueId,
      parentUniqueId,
    );
    const externalResponse = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await externalResponse.json();

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: data?.errors?.non_field_errors?.[0] ?? "Login failed" },
        { status: externalResponse.status },
      );
    }

    const accountData: Role = data.data;
    const newAccount = buildNewAccount(
      accountData?.user_info,
      data.access_token,
      uniqueId,
    );
    const current_account = updateAccounts(existingAccounts, newAccount);
    const redirect = getRedirectionPath(
      accountData?.permissions?.[0]?.permission_name ?? "",
    );

    const res = NextResponse.json({
      accessToken: data.access_token,
      redirect,
      message: "Login successful",
    });

    if (data.data) {
      const isAccountExist = existingAccounts.length > 0;
      const cookieData = {
        accountData,
        currentAccount: isAccountExist ? [] : current_account,
        accessToken: data.access_token,
        uniqueId,
      };

      await storeCookies(baseUrl, cookieData, res, uniqueId);

      if (isAccountExist) {
        await updateAccountCookie(
          baseUrl,
          current_account,
          parentUniqueId || existingUniqueId,
        );
      }
    }

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
