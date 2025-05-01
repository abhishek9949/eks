"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { checkPermissionByPath } from "@/utils/permissionFormate";
import Forbidden from "@/components/Forbidden";
import { URL_CONSTANTS } from "@/constants/routingUrl";

interface ProtectedRouteProps {
  requiredPermission: string;
  children: ReactNode;
}

const commonPaths = [
  "/personal-info",
  "/personal-info/notifications",
];

const ProtectedRoute = ({ requiredPermission, children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const isCommonPath = commonPaths.includes(pathname);

  useEffect(() => {
    if (!cookies?.tokenCookie?.token) {
      router.push(URL_CONSTANTS.LOGIN);
    } else if (isCommonPath) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(checkPermissionByPath(requiredPermission, permissions));
    }
  }, [cookies, requiredPermission, pathname, router, permissions, isCommonPath]);

  if (isAuthorized === null) return null;

  if (!isAuthorized) {
    return <Forbidden />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
