import { menuGroups } from "@/constants/menuGroups";
import { PermissionProps, SidebarItemProps } from "@/types/sidebar";

export const getRedirectionPath = (
  permission: string,
): { url: string; name: string } | null => {
  // Find the matching menu item based on the permission name
  const matchedMenu = menuGroups.find(
    (menu) => menu.permission_name === permission,
  );

  if (matchedMenu) {
    // If subpermissions exist, return the first subpermission's details
    if (matchedMenu.subpermissions && matchedMenu.subpermissions.length > 0) {
      const firstSubpermission = matchedMenu.navigation;
      return {
        url: firstSubpermission,
        name: permission,
      };
    }

    // Return the main permission if no subpermissions are available
    return {
      url: matchedMenu.navigation,
      name: permission,
    };
  }

  console.warn(`No matching permission found for: ${permission}`);
  return null;
};

export const mapItemsToPermissions = (
  permissions: PermissionProps[],
): { educatorMenuItems: SidebarItemProps[]; adminMenuItems: SidebarItemProps[] } => {
  const educatorMenuItems: SidebarItemProps[] = [];
  const adminMenuItems: SidebarItemProps[] = [];

  permissions.forEach((permission) => {
    const matchedMenu = menuGroups.find(
      (menu) => menu.permission_name === permission.permission_name,
    );

    if (matchedMenu?.isSideMenuDisplay) {
      let newItem: SidebarItemProps = { ...matchedMenu };

      if (
        Array.isArray(permission.subpermissions) &&
        permission.subpermissions.length > 0
      ) {
        const matchedChildren = matchedMenu.subpermissions?.filter(
          (child) =>
            permission.subpermissions?.includes(child.permission_name) &&
            child.isSideMenuDisplay,
        );

        newItem = {
          ...matchedMenu,
          subpermissions: matchedChildren,
        };
      }

      if (newItem.isEducator) {
        educatorMenuItems.push(newItem);
      } else {
        adminMenuItems.push(newItem);
      }
    } else {
      console.warn(
        `No match found or isSideMenuDisplay is false for permission: ${permission.permission_name}`,
      );
    }
  });

  return { educatorMenuItems, adminMenuItems };
};


// Utility function that accepts permissions as a parameter
export const checkPermissionExists = (
  name: string | string[],
  permissions: PermissionProps[],
) => {
  return permissions.some((permission) => {
    // Convert name to an array if it's a string
    const names = Array.isArray(name) ? name : [name];

    return names.some(
      (n) =>
        permission.permission_name === n ||
        permission.subpermissions?.includes(n),
    );
  });
};

function getSimilarity(a: string, b: string): number {
  const lenA = a.length;
  const lenB = b.length;

  // NOSONAR
  // const dp: number[][] = Array.from({ length: lenB + 1 }, (_, i) =>
  //   Array.from({ length: lenA + 1 }, (_, j) =>
  //     i === 0 ? j : j === 0 ? i : 0
  //   )
  // );
  
  const dp: number[][] = Array.from({ length: lenB + 1 }, (_, i) =>
    Array.from({ length: lenA + 1 }, (_, j) => {
      if (i === 0) return j;
      if (j === 0) return i;
      return 0;
    })
  );

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (b[i - 1] === a[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  const distance = dp[lenB][lenA];
  const maxLen = Math.max(lenA, lenB);
  return 1 - distance / maxLen;
}

function isRouteMatch(path1: string, path2: string, threshold: number = 0.9): boolean {
  // NOSONAR
  // const normalize = (str: string) => str.replace(/^\/|\/$/g, '');
  const normalize = (str: string) => str.replace(/(^\/)|(\/$)/g, '');

  const p1 = normalize(path1);
  const p2 = normalize(path2);

  // Levenshtein similarity
  if (getSimilarity(p1, p2) >= threshold) return true;

  const parts1 = p1.split('/');
  const parts2 = p2.split('/');

  // Same base (excluding last segment)
  const base1 = parts1.slice(0, -1).join('/');
  const base2 = parts2.slice(0, -1).join('/');
  if (base1 && base1 === base2) return true;

  // Case: "/content-details/:id" vs "/content-details"
  if (
    (p1.startsWith(p2) && parts1.length === parts2.length + 1) ||
    (p2.startsWith(p1) && parts2.length === parts1.length + 1)
  ) {
    return true;
  }

  return false;
}


export const checkPermissionByPath = (
  path: string,
  permissions: PermissionProps[],
): boolean => {

  const findMatchingMenu = (
    items: SidebarItemProps[],
  ): SidebarItemProps | null => {
    for (const item of items) {

      const similarity = isRouteMatch(path, item.navigation);

      if (similarity) {
        return item;
      }
      if (item.subpermissions) {
        const found = findMatchingMenu(item.subpermissions);
        if (found) return found;
      }
    }
    return null;
  };

  const matchedMenu = findMatchingMenu(menuGroups);
  if (!matchedMenu) return false;

  const hasPermission = permissions.some((perm) => {
    if (perm.permission_name === matchedMenu.permission_name) {
      return true;
    }
    return perm.subpermissions?.includes(matchedMenu.permission_name);
  });

  return hasPermission;
};