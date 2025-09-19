export const getCurrentTitle = (path) => {
  // Dashboard routes
  if (path === "/") return "";
  if (path.startsWith("/credit-deviation/dashboard")) return "Credit Deviation Dashboard";
  if (path.startsWith("/jvm/dashboard")) return "JVM Dashboard";
  if (path.startsWith("/import-payment/dashboard")) return "Import Payment Dashboard";
  if (path.startsWith("/custom-duty/dashboard")) return "Custom Duty Dashboard";
  if (path.startsWith("/petty-cash/dashboard")) return "Petty Cash Dashboard";

  // Credit Deviation routes
  if (path.startsWith("/credit-deviation/request-status/view/")) return "Request Details";
  if (path.startsWith("/credit-deviation/approvals/view/")) return "Request Details";
  if (path.startsWith("/credit-deviation/request-status")) return "My Requests";
  if (path.startsWith("/credit-deviation/request")) return "Request";
  if (path.startsWith("/credit-deviation/approvals")) return "Approvals Requests";
  if (path.startsWith("/credit-deviation/usermanagement")) return "User Management";
  if (path.startsWith("/credit-deviation/master")) return "Master Data";
  if (path.startsWith("/credit-deviation/hierarchy-management")) return "Hierarchy Management";
  if (path.startsWith("/credit-deviation/master-sheet")) return "Master Sheet";

  // JVM routes
  if (path.startsWith("/jvm/jv-status/jv-detail/")) return "JV Detail";
  if (path.startsWith("/jvm/jv-status")) return "JV Status";
  if (path.startsWith("/jvm/initiate-jv")) return "Initiate Journal Voucher";

  // Import Payment routes
  if (path.startsWith("/import-payment/upload")) return "Import Payment Upload";

  // Custom Duty routes
  if (path.startsWith("/custom-duty/raise-to-bank/submit-detail/")) return "Submit Detail";
  if (path.startsWith("/custom-duty/raise-to-bank")) return "Raise to Bank";
  if (path.startsWith("/custom-duty/requests")) return "Requests";
  if (path.startsWith("/custom-duty/my-requests")) return "My Requests";
  if (path.startsWith("/custom-duty/raise-request")) return "Raise Request";
  if (path.startsWith("/custom-duty/payment")) return "Custom Duty Payment";
  if (path.startsWith("/custom-duty/master")) return "Custom Duty Master Data";

  // Petty Cash routes
  if (path.startsWith("/petty-cash/request")) return "Petty Cash Request";

  // Auth routes
  if (path.startsWith("/login")) return "Login";
  if (path.startsWith("/otp-verification")) return "OTP Verification";
  if (path.startsWith("/reset-password")) return "Reset Password";

  // Error routes
  if (path.startsWith("/404")) return "Page Not Found";

  return "Welcome back 👋";
};

// Route title constants for easy reference
export const ROUTE_TITLES = {
  // Dashboard
  HOME: "",
  CREDIT_DEVIATION_DASHBOARD: "Credit Deviation Dashboard",
  JVM_DASHBOARD: "JVM Dashboard",
  IMPORT_PAYMENT_DASHBOARD: "Import Payment Dashboard",
  CUSTOM_DUTY_DASHBOARD: "Custom Duty Dashboard",
  PETTY_CASH_DASHBOARD: "Petty Cash Dashboard",

  // Credit Deviation
  REQUEST_DETAILS: "Request Details",
  MY_REQUESTS: "My Requests",
  REQUEST: "Request",
  APPROVALS_REQUESTS: "Approvals Requests",
  USER_MANAGEMENT: "User Management",
  MASTER_DATA: "Master Data",
  HIERARCHY_MANAGEMENT: "Hierarchy Management",
  MASTER_SHEET: "Master Sheet",

  // JVM
  JV_DETAIL: "JV Detail",
  JV_STATUS: "JV Status",
  INITIATE_JOURNAL_VOUCHER: "Initiate Journal Voucher",

  // Import Payment
  IMPORT_PAYMENT_UPLOAD: "Import Payment Upload",

  // Custom Duty
  SUBMIT_DETAIL: "Submit Detail",
  RAISE_TO_BANK: "Raise to Bank",
  REQUESTS: "Requests",
  CUSTOM_DUTY_MY_REQUESTS: "My Requests",
  RAISE_REQUEST: "Raise Request",
  CUSTOM_DUTY_PAYMENT: "Custom Duty Payment",
  CUSTOM_DUTY_MASTER: "Custom Duty Master Data",

  // Petty Cash
  PETTY_CASH_REQUEST: "Petty Cash Request",

  // Auth
  LOGIN: "Login",
  OTP_VERIFICATION: "OTP Verification",
  RESET_PASSWORD: "Reset Password",

  // Error
  PAGE_NOT_FOUND: "Page Not Found",

  // Default
  DEFAULT: "Welcome back 👋",
};
