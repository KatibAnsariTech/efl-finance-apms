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
  if (path.startsWith("/jvm/requested-jvs/jv-detail")) return "JV Detail";
  if (path.startsWith("/jvm/requested-jvs")) return "JV Status";
  if (path.startsWith("/jvm/initiate-jv")) return "Initiate Journal Voucher";
  if (path.startsWith("/jvm/auto-reversal")) return "Auto Reversal";
  if (path.startsWith("/jvm/master")) return "JVM Master Data";

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

  // settings routes
  if (path.startsWith("/settings/profile")) return "Profile";
  if (path.startsWith("/settings/change-password")) return "Change Password";
  if (path.startsWith("/settings/add-user")) return "Add User";
  if (path.startsWith("/settings")) return "Settings";
  
  // Error routes
  if (path.startsWith("/404")) return "Page Not Found";

  return "Welcome back 👋";
};

