import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosConfig";
import { getCurrentUser, isAuthenticated } from "../utils/auth";
import type { UserPermissions, Permission, Role, Module } from "../utils/permissions";
import {
  ROLES,
  hasPermission,
  hasAllPermissions,
  canAccessModule,
  isSuperAdmin,
} from "../utils/permissions";

// Context state interface
interface PermissionContextState {
  permissions: UserPermissions | null;
  loading: boolean;
  error: string | null;
  fetchPermissions: () => Promise<void>;
  clearPermissions: () => void;
  hasPermission: (requiredPermission: Permission | Permission[]) => boolean;
  hasAllPermissions: (requiredPermissions: Permission[]) => boolean;
  canAccessModule: (module: Module) => boolean;
  isSuperAdmin: () => boolean;
}

// API response interface
interface PermissionsApiResponse {
  role: string;
  permissions: string[];
}

// Create context with default values
const PermissionContext = createContext<PermissionContextState>({
  permissions: null,
  loading: false,
  error: null,
  fetchPermissions: async () => {},
  clearPermissions: () => {},
  hasPermission: () => false,
  hasAllPermissions: () => false,
  canAccessModule: () => false,
  isSuperAdmin: () => false,
});

// Provider props
interface PermissionProviderProps {
  children: ReactNode;
}

// Permission Provider Component
export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  // Initialize permissions from localStorage if available
  const getInitialPermissions = (): UserPermissions | null => {
    const storedPermissions = localStorage.getItem("user_permissions");
    if (storedPermissions) {
      try {
        return JSON.parse(storedPermissions);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [permissions, setPermissions] = useState<UserPermissions | null>(getInitialPermissions);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch permissions from backend API
  const fetchPermissions = useCallback(async () => {
    // Check if user is authenticated before fetching
    if (!isAuthenticated()) {
      setPermissions(null);
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setPermissions(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use axiosInstance - it will automatically attach Bearer token
      const response = await axiosInstance.get<PermissionsApiResponse>('/api/permissions');

      const fetchedPermissions = {
        role: (response.data.role?.toUpperCase() || currentUser.role?.toUpperCase() || "USER") as Role,
        permissions: response.data.permissions as Permission[],
      };
      setPermissions(fetchedPermissions);
      localStorage.setItem("user_permissions", JSON.stringify(fetchedPermissions));
    } catch (err: any) {
      // On error (404, 401, network error), fallback to user's stored role with default permissions
      // Note: 401 errors are automatically handled by axiosInstance interceptor (logout + redirect)
      const userRole = (currentUser.role?.toUpperCase() || "USER") as Role;
      const defaultPerms = getDefaultPermissionsForRole(userRole);
      const fallbackPermissions = {
        role: userRole,
        permissions: defaultPerms,
      };
      setPermissions(fallbackPermissions);
      localStorage.setItem("user_permissions", JSON.stringify(fallbackPermissions));
      
      // Only set error if not a 401 (which triggers redirect)
      if (err.response?.status !== 401) {
        setError("Failed to fetch permissions from server, using defaults");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear permissions (for logout)
  const clearPermissions = useCallback(() => {
    setPermissions(null);
    setError(null);
    localStorage.removeItem("user_permissions");
  }, []);

  // Check if user has a specific permission
  const checkPermission = useCallback(
    (requiredPermission: Permission | Permission[]): boolean => {
      return hasPermission(permissions, requiredPermission);
    },
    [permissions]
  );

  // Check if user has all specified permissions
  const checkAllPermissions = useCallback(
    (requiredPermissions: Permission[]): boolean => {
      return hasAllPermissions(permissions, requiredPermissions);
    },
    [permissions]
  );

  // Check if user can access a module
  const checkModuleAccess = useCallback(
    (module: Module): boolean => {
      return canAccessModule(permissions, module);
    },
    [permissions]
  );

  // Check if current user is Super Admin
  const checkIsSuperAdmin = useCallback((): boolean => {
    return isSuperAdmin(permissions?.role);
  }, [permissions]);

  // Fetch permissions on mount if user is logged in
  useEffect(() => {
    if (isAuthenticated()) {
      fetchPermissions();
    } else {
      // Clear permissions if not authenticated
      clearPermissions();
    }
  }, [fetchPermissions, clearPermissions]);

  // Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "current_user") {
        if (e.newValue) {
          fetchPermissions();
        } else {
          clearPermissions();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchPermissions, clearPermissions]);

  const value: PermissionContextState = {
    permissions,
    loading,
    error,
    fetchPermissions,
    clearPermissions,
    hasPermission: checkPermission,
    hasAllPermissions: checkAllPermissions,
    canAccessModule: checkModuleAccess,
    isSuperAdmin: checkIsSuperAdmin,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook to use permission context
export const usePermissions = (): PermissionContextState => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

// Helper function to get default permissions for a role (fallback)
const getDefaultPermissionsForRole = (role: Role): Permission[] => {
  // Super Admin gets all permissions by default (though they bypass checks anyway)
  if (role === ROLES.SUPER_ADMIN) {
    return []; // Super Admin doesn't need explicit permissions
  }

  // Admin gets broad access
  if (role === ROLES.ADMIN) {
    return [
      "DASHBOARD_READ",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "INVENTORY_CREATE",
      "INVENTORY_DELETE",
      "STOCK_READ",
      "STOCK_WRITE",
      "SALES_READ",
      "SALES_WRITE",
      "SALES_CREATE",
      "POS_READ",
      "POS_WRITE",
      "PROMO_READ",
      "PROMO_WRITE",
      "PURCHASES_READ",
      "PURCHASES_WRITE",
      "FINANCE_READ",
      "FINANCE_WRITE",
      "PEOPLE_READ",
      "PEOPLE_WRITE",
      "HRM_READ",
      "HRM_WRITE",
      "REPORTS_READ",
      "CONTENT_READ",
      "CONTENT_WRITE",
      "USER_MANAGEMENT_READ",
      "USER_MANAGEMENT_WRITE",
      "SETTINGS_READ",
      "SETTINGS_WRITE",
    ] as Permission[];
  }

  // Manager gets operational access
  if (role === ROLES.MANAGER) {
    return [
      "DASHBOARD_READ",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "STOCK_READ",
      "STOCK_WRITE",
      "SALES_READ",
      "SALES_WRITE",
      "POS_READ",
      "PURCHASES_READ",
      "PURCHASES_WRITE",
      "PEOPLE_READ",
      "HRM_READ",
      "REPORTS_READ",
    ] as Permission[];
  }

  // Salesman gets sales-focused access
  if (role === ROLES.SALESMAN) {
    return [
      "DASHBOARD_READ",
      "INVENTORY_READ",
      "SALES_READ",
      "SALES_WRITE",
      "SALES_CREATE",
      "POS_READ",
      "POS_WRITE",
      "PEOPLE_READ",
    ] as Permission[];
  }

  // Cashier gets POS access
  if (role === ROLES.CASHIER) {
    return [
      "DASHBOARD_READ",
      "POS_READ",
      "POS_WRITE",
      "SALES_READ",
      "SALES_CREATE",
    ] as Permission[];
  }

  // Store Keeper / Inventory Manager gets stock access
  if (role === ROLES.STORE_KEEPER || role === ROLES.INVENTORY_MANAGER) {
    return [
      "DASHBOARD_READ",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "STOCK_READ",
      "STOCK_WRITE",
      "PURCHASES_READ",
    ] as Permission[];
  }

  // Default for other roles - basic read access
  return ["DASHBOARD_READ"] as Permission[];
};

export default PermissionContext;

