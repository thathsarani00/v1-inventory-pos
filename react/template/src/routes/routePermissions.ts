// Route permission configuration
// Maps routes to their required permissions

import type { Permission, Module } from "../utils/permissions";
import { MODULES } from "../utils/permissions";
import { all_routes } from "./all_routes";

// Route permission configuration interface
export interface RoutePermissionConfig {
  path: string;
  permission?: Permission | Permission[];
  module?: Module;
  requireAll?: boolean;
  // Public routes that don't require authentication
  isPublic?: boolean;
}

// Define route permissions
export const routePermissions: RoutePermissionConfig[] = [
  // ============ PUBLIC ROUTES ============
  { path: all_routes.signin, isPublic: true },
  { path: all_routes.signintwo, isPublic: true },
  { path: all_routes.signinthree, isPublic: true },
  { path: all_routes.register, isPublic: true },
  { path: all_routes.registerTwo, isPublic: true },
  { path: all_routes.registerThree, isPublic: true },
  { path: all_routes.forgotPassword, isPublic: true },
  { path: all_routes.forgotPasswordTwo, isPublic: true },
  { path: all_routes.forgotPasswordThree, isPublic: true },
  { path: all_routes.resetpassword, isPublic: true },
  { path: all_routes.resetpasswordTwo, isPublic: true },
  { path: all_routes.resetpasswordThree, isPublic: true },
  { path: all_routes.emailverification, isPublic: true },
  { path: all_routes.emailverificationTwo, isPublic: true },
  { path: all_routes.emailverificationThree, isPublic: true },
  { path: all_routes.twostepverification, isPublic: true },
  { path: all_routes.twostepverificationTwo, isPublic: true },
  { path: all_routes.twostepverificationThree, isPublic: true },
  { path: all_routes.lockscreen, isPublic: true },
  { path: all_routes.error404, isPublic: true },
  { path: all_routes.error500, isPublic: true },
  { path: all_routes.comingsoon, isPublic: true },
  { path: all_routes.undermaintenance, isPublic: true },
  { path: "/error-403", isPublic: true },

  // ============ DASHBOARD ROUTES ============
  { path: all_routes.newdashboard, module: MODULES.DASHBOARD, permission: "DASHBOARD_READ" },
  { path: all_routes.dashboard, module: MODULES.DASHBOARD, permission: "DASHBOARD_READ" },
  { path: all_routes.salesdashboard, module: MODULES.DASHBOARD, permission: "DASHBOARD_READ" },

  // ============ SUPER ADMIN ROUTES ============
  // These are restricted to Super Admin only (via module check)
  { path: all_routes.superadmindashboard, module: MODULES.SUPER_ADMIN },
  { path: all_routes.companies, module: MODULES.SUPER_ADMIN },
  { path: all_routes.subscription, module: MODULES.SUPER_ADMIN },
  { path: all_routes.packagelist, module: MODULES.SUPER_ADMIN },
  { path: all_routes.domain, module: MODULES.SUPER_ADMIN },
  { path: all_routes.purchasetransaction, module: MODULES.SUPER_ADMIN },

  // ============ INVENTORY ROUTES ============
  { path: all_routes.productlist, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.addproduct, module: MODULES.INVENTORY, permission: "INVENTORY_CREATE" },
  { path: all_routes.editproduct, module: MODULES.INVENTORY, permission: "INVENTORY_WRITE" },
  { path: all_routes.productdetails, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.expiredproduct, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.lowstock, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.categorylist, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.subcategories, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.brandlist, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.units, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.variantyattributes, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.warranty, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.barcode, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },
  { path: all_routes.qrcode, module: MODULES.INVENTORY, permission: "INVENTORY_READ" },

  // ============ STOCK ROUTES ============
  { path: all_routes.managestock, module: MODULES.STOCK, permission: "STOCK_READ" },
  { path: all_routes.stockadjustment, module: MODULES.STOCK, permission: "STOCK_WRITE" },
  { path: all_routes.stocktransfer, module: MODULES.STOCK, permission: "STOCK_WRITE" },

  // ============ SALES ROUTES ============
  { path: all_routes.saleslist, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.onlineorder, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.posorder, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.invoice, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.invoicedetails, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.salesreturn, module: MODULES.SALES, permission: "SALES_READ" },
  { path: all_routes.quotationlist, module: MODULES.SALES, permission: "SALES_READ" },

  // ============ POS ROUTES ============
  { path: all_routes.pos, module: MODULES.POS, permission: "POS_READ" },
  { path: all_routes.pos2, module: MODULES.POS, permission: "POS_READ" },
  { path: all_routes.pos3, module: MODULES.POS, permission: "POS_READ" },
  { path: all_routes.pos4, module: MODULES.POS, permission: "POS_READ" },
  { path: all_routes.pos5, module: MODULES.POS, permission: "POS_READ" },

  // ============ PROMO ROUTES ============
  { path: all_routes.coupons, module: MODULES.PROMO, permission: "PROMO_READ" },
  { path: all_routes.GiftCard, module: MODULES.PROMO, permission: "PROMO_READ" },
  { path: all_routes.discount, module: MODULES.PROMO, permission: "PROMO_READ" },
  { path: all_routes.discountPlan, module: MODULES.PROMO, permission: "PROMO_READ" },

  // ============ PURCHASES ROUTES ============
  { path: all_routes.purchaselist, module: MODULES.PURCHASES, permission: "PURCHASES_READ" },
  { path: all_routes.purchaseorderreport, module: MODULES.PURCHASES, permission: "PURCHASES_READ" },
  { path: all_routes.purchasereturn, module: MODULES.PURCHASES, permission: "PURCHASES_READ" },

  // ============ FINANCE ROUTES ============
  { path: all_routes.expenselist, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.expensecategory, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.incomelist, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.incomecategory, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.accountlist, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.moneytransfer, module: MODULES.FINANCE, permission: "FINANCE_WRITE" },
  { path: all_routes.balancesheet, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.trailbalance, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.cashflow, module: MODULES.FINANCE, permission: "FINANCE_READ" },
  { path: all_routes.accountstatement, module: MODULES.FINANCE, permission: "FINANCE_READ" },

  // ============ PEOPLE ROUTES ============
  { path: all_routes.customers, module: MODULES.PEOPLE, permission: "PEOPLE_READ" },
  { path: all_routes.biller, module: MODULES.PEOPLE, permission: "PEOPLE_READ" },
  { path: all_routes.suppliers, module: MODULES.PEOPLE, permission: "PEOPLE_READ" },
  { path: all_routes.storelist, module: MODULES.PEOPLE, permission: "PEOPLE_READ" },
  { path: all_routes.warehouses, module: MODULES.PEOPLE, permission: "PEOPLE_READ" },

  // ============ HRM ROUTES ============
  { path: all_routes.employeegrid, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.employeelist, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.employeedetails, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.addemployee, module: MODULES.HRM, permission: "HRM_CREATE" },
  { path: all_routes.editemployee, module: MODULES.HRM, permission: "HRM_WRITE" },
  { path: all_routes.departmentgrid, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.departmentlist, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.designation, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.shift, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.attendanceemployee, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.attendanceadmin, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.leavesemployee, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.leavesadmin, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.leavestype, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.holidays, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.payrollList, module: MODULES.HRM, permission: "HRM_READ" },
  { path: all_routes.payslip, module: MODULES.HRM, permission: "HRM_READ" },

  // ============ REPORTS ROUTES ============
  { path: all_routes.salesreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.bestseller, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.purchasereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.inventoryreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.stockhistory, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.soldstock, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.invoicereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.supplierreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.supplierduereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.customerreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.customerduereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.productreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.productexpiredreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.productquantityreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.expensereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.incomereport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.taxreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.profitloss, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.annualreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },
  { path: all_routes.saletaxreport, module: MODULES.REPORTS, permission: "REPORTS_READ" },

  // ============ CONTENT ROUTES ============
  { path: all_routes.pagesList, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.allBlogs, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.blogDetails, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.blogCategories, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.blogComments, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.blogTag, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.countries, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.states, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.cities, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.testimonial, module: MODULES.CONTENT, permission: "CONTENT_READ" },
  { path: all_routes.faq, module: MODULES.CONTENT, permission: "CONTENT_READ" },

  // ============ USER MANAGEMENT ROUTES ============
  { path: all_routes.users, module: MODULES.USER_MANAGEMENT, permission: "USER_MANAGEMENT_READ" },
  { path: all_routes.rolespermission, module: MODULES.USER_MANAGEMENT, permission: "USER_MANAGEMENT_READ" },
  { path: all_routes.permissions, module: MODULES.USER_MANAGEMENT, permission: "USER_MANAGEMENT_READ" },
  { path: all_routes.deleteaccount, module: MODULES.USER_MANAGEMENT, permission: "USER_MANAGEMENT_READ" },

  // ============ SETTINGS ROUTES ============
  { path: all_routes.generalsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.securitysettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.notification, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.connectedapps, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.systemsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.companysettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.localizationsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.prefixes, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.preference, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.appearance, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.socialauthendication, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.languagesettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.invoicesettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.invoicetemplate, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.printersettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.possettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.customfields, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.emailsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.emailtemplate, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.smssettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.smstemplate, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.otpsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.gdbrsettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.paymentgateway, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.banksettingslist, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.banksettingsgrid, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.taxrates, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.currencysettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.storagesettings, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.banipaddress, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },
  { path: all_routes.signatures, module: MODULES.SETTINGS, permission: "SETTINGS_READ" },

  // ============ APPLICATION ROUTES ============
  { path: all_routes.chat, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.videocall, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.audiocall, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.callhistory, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.calendars, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.email, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.emailreply, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.todo, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.todolist, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.notes, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.filemanager, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.projects, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.SocialFeed, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.Kanban, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.searchlist, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },
  { path: all_routes.contact, module: MODULES.APPLICATION, permission: "APPLICATION_READ" },

  // ============ PROFILE (available to all authenticated users) ============
  { path: all_routes.profile, permission: "DASHBOARD_READ" },
  { path: all_routes.blankpage, permission: "DASHBOARD_READ" },
  { path: all_routes.activities, permission: "DASHBOARD_READ" },
  { path: all_routes.pricing, permission: "DASHBOARD_READ" },
];

// Get permission config for a route
export const getRoutePermissionConfig = (path: string): RoutePermissionConfig | undefined => {
  return routePermissions.find((config) => config.path === path);
};

// Check if a route is public
export const isPublicRoute = (path: string): boolean => {
  const config = getRoutePermissionConfig(path);
  return config?.isPublic === true;
};

// Get required permission for a route
export const getRoutePermission = (path: string): Permission | Permission[] | undefined => {
  const config = getRoutePermissionConfig(path);
  return config?.permission;
};

// Get required module for a route
export const getRouteModule = (path: string): Module | undefined => {
  const config = getRoutePermissionConfig(path);
  return config?.module;
};

