import type { ReactNode } from "react";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import type { Permission, Module } from "../utils/permissions";
import { isAuthenticated } from "../utils/auth";
import { all_routes } from "../routes/all_routes";

interface ProtectedRouteProps {
  children: ReactNode;
  // Required permission(s) - user needs at least one
  permissions?: Permission | Permission[];
  // Required module access
  module?: Module;
  // Require all permissions instead of any
  requireAll?: boolean;
  // Fallback component while loading
  loadingFallback?: ReactNode;
  // Custom redirect path for unauthorized access
  unauthorizedRedirect?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permissions,
  module,
  requireAll = false,
  loadingFallback,
  unauthorizedRedirect,
}) => {
  const location = useLocation();
  const {
    permissions: userPermissions,
    loading,
    hasPermission,
    hasAllPermissions,
    canAccessModule,
    isSuperAdmin,
  } = usePermissions();

  // Check if user is authenticated (has valid token and user data)
  if (!isAuthenticated()) {
    return (
      <Navigate to={all_routes.signin} state={{ from: location }} replace />
    );
  }

  // Show loading state while fetching permissions
  if (loading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Super Admin bypasses all permission checks
  if (isSuperAdmin()) {
    return <>{children}</>;
  }

  // Check module access if specified
  if (module && !canAccessModule(module)) {
    return (
      <Navigate
        to={unauthorizedRedirect || "/error-403"}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check permissions if specified
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(
          Array.isArray(permissions) ? permissions : [permissions]
        )
      : hasPermission(permissions);

    if (!hasAccess) {
      return (
        <Navigate
          to={unauthorizedRedirect || "/error-403"}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  // If no specific permissions required, just check if user has any permissions
  if (!permissions && !module && !userPermissions) {
    return (
      <Navigate
        to={unauthorizedRedirect || all_routes.signin}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};

// Higher-order component version for class components or route wrapping
export const withProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    permissions?: Permission | Permission[];
    module?: Module;
    requireAll?: boolean;
  }
) => {
  const WithProtectedRoute: React.FC<P> = (props) => {
    return (
      <ProtectedRoute
        permissions={options?.permissions}
        module={options?.module}
        requireAll={options?.requireAll}
      >
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  WithProtectedRoute.displayName = `WithProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithProtectedRoute;
};

export default ProtectedRoute;

