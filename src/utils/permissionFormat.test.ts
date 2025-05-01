import {
  getRedirectionPath,
  mapItemsToPermissions,
  checkPermissionExists,
  checkPermissionByPath,
} from "@/utils/permissionFormate";
import { PermissionProps } from "@/types/sidebar";

jest.mock("@/constants/menuGroups", () => ({
  menuGroups: [
    {
      permission_name: "dashboard",
      navigation: "/dashboard",
      isSideMenuDisplay: true,
      subpermissions: [
        {
          permission_name: "dashboard.view",
          navigation: "/dashboard/view",
          isSideMenuDisplay: true,
        },
      ],
    },
    {
      permission_name: "settings",
      navigation: "/settings",
      isSideMenuDisplay: false,
    },
  ],
}));

describe("getRedirectionPath", () => {
  it("should return the first subpermission path if it exists", () => {
    const result = getRedirectionPath("dashboard");
    expect(result).toEqual({ url: "/dashboard", name: "dashboard" });
  });

  it("should return null for an unknown permission", () => {
    const result = getRedirectionPath("unknown");
    expect(result).toBeNull();
  });
});

describe("mapItemsToPermissions", () => {
  const permissions: PermissionProps[] = [
    {
      permission_name: "dashboard",
      subpermissions: ["dashboard.view"],
    },
    {
      permission_name: "settings",
      subpermissions: [],
    },
  ];

  it("should map visible permissions correctly", () => {
    const result = mapItemsToPermissions(permissions);
    expect(result.adminMenuItems.length).toBe(1);
    expect(result.educatorMenuItems.length).toBe(0);
    expect(result.adminMenuItems[0].permission_name).toBe("dashboard");
    expect(result.adminMenuItems[0].subpermissions?.[0].permission_name).toBe("dashboard.view");
  });
});

describe("checkPermissionExists", () => {
  const permissions: PermissionProps[] = [
    {
      permission_name: "dashboard",
      subpermissions: ["dashboard.view"],
    },
  ];

  it("should return true if permission matches", () => {
    expect(checkPermissionExists("dashboard", permissions)).toBe(true);
  });

  it("should return true if subpermission matches", () => {
    expect(checkPermissionExists("dashboard.view", permissions)).toBe(true);
  });

  it("should return false for unknown permission", () => {
    expect(checkPermissionExists("unknown", permissions)).toBe(false);
  });

  it("should work with array of names", () => {
    expect(checkPermissionExists(["unknown", "dashboard.view"], permissions)).toBe(true);
  });
});

describe("checkPermissionByPath", () => {
  const permissions: PermissionProps[] = [
    {
      permission_name: "dashboard",
      subpermissions: ["dashboard.view"],
    },
  ];

  it("should return true for valid path", () => {
    const result = checkPermissionByPath("/dashboard", permissions);
    expect(result).toBe(true);
  });

  it("should return false for invalid path", () => {
    const result = checkPermissionByPath("/invalid", permissions);
    expect(result).toBe(false);
  });
});
