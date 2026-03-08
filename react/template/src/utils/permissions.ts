// Permission types and constants for RBAC system

// Role constants
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SALESMAN: "SALESMAN",
  SUPERVISOR: "SUPERVISOR",
  STORE_KEEPER: "STORE_KEEPER",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  DELIVERY_BIKER: "DELIVERY_BIKER",
  EMPLOYEE: "EMPLOYEE",
  CASHIER: "CASHIER",
  QUALITY_ANALYST: "QUALITY_ANALYST",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Permission action types
export const ACTIONS = {
  READ: "READ",
  WRITE: "WRITE",
  CREATE: "CREATE",
  DELETE: "DELETE",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT",
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

// Module constants
export const MODULES = {
  DASHBOARD: "DASHBOARD",
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION: "APPLICATION",
  INVENTORY: "INVENTORY",
  STOCK: "STOCK",
  SALES: "SALES",
  POS: "POS",
  PROMO: "PROMO",
  PURCHASES: "PURCHASES",
  FINANCE: "FINANCE",
  PEOPLE: "PEOPLE",
  HRM: "HRM",
  REPORTS: "REPORTS",
  CONTENT: "CONTENT",
  USER_MANAGEMENT: "USER_MANAGEMENT",
  SETTINGS: "SETTINGS",
} as const;

export type Module = (typeof MODULES)[keyof typeof MODULES];

// Permission string format: "MODULE_ACTION" e.g., "INVENTORY_READ"
export type Permission = `${Module}_${Action}`;

// Generate all possible permissions
export const PERMISSIONS: Record<string, Permission> = {};
Object.values(MODULES).forEach((module) => {
  Object.values(ACTIONS).forEach((action) => {
    const key = `${module}_${action}`;
    PERMISSIONS[key] = key as Permission;
  });
});

// User permissions interface
export interface UserPermissions {
  role: Role;
  permissions: Permission[];
}

// Check if a role is Super Admin
export const isSuperAdmin = (role: string | undefined): boolean => {
  return role === ROLES.SUPER_ADMIN;
};

// Check if user has a specific permission
// Super Admin always returns true
export const hasPermission = (
  userPermissions: UserPermissions | null,
  requiredPermission: Permission | Permission[]
): boolean => {
  if (!userPermissions) return false;

  // Super Admin bypasses all permission checks
  if (isSuperAdmin(userPermissions.role)) {
    return true;
  }

  // Check if user has the required permission(s)
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((perm) =>
      userPermissions.permissions.includes(perm)
    );
  }

  return userPermissions.permissions.includes(requiredPermission);
};

// Check if user has all of the specified permissions
export const hasAllPermissions = (
  userPermissions: UserPermissions | null,
  requiredPermissions: Permission[]
): boolean => {
  if (!userPermissions) return false;

  // Super Admin bypasses all permission checks
  if (isSuperAdmin(userPermissions.role)) {
    return true;
  }

  return requiredPermissions.every((perm) =>
    userPermissions.permissions.includes(perm)
  );
};

// Check if user can access a module (has any permission for it)
export const canAccessModule = (
  userPermissions: UserPermissions | null,
  module: Module
): boolean => {
  if (!userPermissions) return false;

  // Super Admin bypasses all permission checks
  if (isSuperAdmin(userPermissions.role)) {
    return true;
  }

  // Check if user has any permission for this module
  return userPermissions.permissions.some((perm) => perm.startsWith(module));
};

// Map sidebar labels to modules for permission checking
export const SIDEBAR_MODULE_MAP: Record<string, Module> = {
  Dashboard: MODULES.DASHBOARD,
  "Super Admin": MODULES.SUPER_ADMIN,
  Application: MODULES.APPLICATION,
  Layouts: MODULES.DASHBOARD, // Layouts are part of dashboard
  Products: MODULES.INVENTORY,
  "Create Product": MODULES.INVENTORY,
  "Expired Products": MODULES.INVENTORY,
  "Low Stocks": MODULES.INVENTORY,
  Category: MODULES.INVENTORY,
  "Sub Category": MODULES.INVENTORY,
  Brands: MODULES.INVENTORY,
  Units: MODULES.INVENTORY,
  "Variant Attributes": MODULES.INVENTORY,
  Warranties: MODULES.INVENTORY,
  "Print Barcode": MODULES.INVENTORY,
  "Print QR Code": MODULES.INVENTORY,
  "Manage Stock": MODULES.STOCK,
  "Stock Adjustment": MODULES.STOCK,
  "Stock Transfer": MODULES.STOCK,
  Sales: MODULES.SALES,
  Invoices: MODULES.SALES,
  "Sales Return": MODULES.SALES,
  Quotation: MODULES.SALES,
  POS: MODULES.POS,
  Coupons: MODULES.PROMO,
  "Gift Cards": MODULES.PROMO,
  Discount: MODULES.PROMO,
  Purchases: MODULES.PURCHASES,
  "Purchase Order": MODULES.PURCHASES,
  "Purchase Return": MODULES.PURCHASES,
  Expenses: MODULES.FINANCE,
  Income: MODULES.FINANCE,
  "Bank Accounts": MODULES.FINANCE,
  "Money Transfer": MODULES.FINANCE,
  "Balance Sheet": MODULES.FINANCE,
  "Trial Balance": MODULES.FINANCE,
  "Cash Flow": MODULES.FINANCE,
  "Account Statement": MODULES.FINANCE,
  Customers: MODULES.PEOPLE,
  Billers: MODULES.PEOPLE,
  Suppliers: MODULES.PEOPLE,
  Stores: MODULES.PEOPLE,
  Warehouses: MODULES.PEOPLE,
  Employees: MODULES.HRM,
  Departments: MODULES.HRM,
  Designations: MODULES.HRM,
  Shifts: MODULES.HRM,
  Attendance: MODULES.HRM,
  Leaves: MODULES.HRM,
  Holidays: MODULES.HRM,
  Payroll: MODULES.HRM,
  "Sales Report": MODULES.REPORTS,
  "Purchase Report": MODULES.REPORTS,
  "Inventory Report": MODULES.REPORTS,
  "Invoice Report": MODULES.REPORTS,
  "Supplier Report": MODULES.REPORTS,
  "Customer Report": MODULES.REPORTS,
  "Product Report": MODULES.REPORTS,
  "Expense Report": MODULES.REPORTS,
  "Income Report": MODULES.REPORTS,
  "Tax Report": MODULES.REPORTS,
  "Profit & Loss": MODULES.REPORTS,
  "Annual Report": MODULES.REPORTS,
  Pages: MODULES.CONTENT,
  Blog: MODULES.CONTENT,
  Location: MODULES.CONTENT,
  Testimonials: MODULES.CONTENT,
  FAQ: MODULES.CONTENT,
  Users: MODULES.USER_MANAGEMENT,
  "Roles & Permissions": MODULES.USER_MANAGEMENT,
  "Delete Account Request": MODULES.USER_MANAGEMENT,
  "General Settings": MODULES.SETTINGS,
  "Website Settings": MODULES.SETTINGS,
  "App Settings": MODULES.SETTINGS,
  "System Settings": MODULES.SETTINGS,
  "Financial Settings": MODULES.SETTINGS,
  "Other Settings": MODULES.SETTINGS,
};

// Get module for a sidebar item label
export const getModuleForSidebarItem = (label: string): Module | null => {
  return SIDEBAR_MODULE_MAP[label] || null;
};

