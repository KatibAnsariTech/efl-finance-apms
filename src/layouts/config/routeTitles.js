export const getCurrentTitle = (path) => {
  // Dashboard routes
  if (path === "/") return "";
  if (path.startsWith("/jvm/dashboard")) return "Dashboard";
  if (path.startsWith("/import-payment/dashboard")) return "Dashboard";
  if (path.startsWith("/custom-duty/dashboard")) return "Dashboard";
  if (path.startsWith("/petty-cash/dashboard")) return "Dashboard";

  // JVM routes
  if (path.startsWith("/jvm/requested-jvs/") && path.split('/').length === 5) return "JV Detail";
  if (path.startsWith("/jvm/requested-jvs/") && path.split('/').length === 4) return "JVs by Group";
  if (path.startsWith("/jvm/requested-jvs")) return "JV Status";
  if (path.startsWith("/jvm/initiate-jv")) return "Initiate Journal Voucher";
  if (path.startsWith("/jvm/auto-reversal")) return "Auto Reversal";
  if (path.startsWith("/jvm/report")) return "JVM Report";
  if (path.startsWith("/jvm/master")) return "Master Data";
  if (path.startsWith("/jvm/usermanagement")) return "User Management";
  if (path.startsWith("/jvm/hierarchy-management")) return "Hierarchy Management";
  if (path.startsWith("/jvm/requests/") && path.split('/').length === 5) return "JV Detail";
  if (path.startsWith("/jvm/requests/") && path.split('/').length === 4) return "JVs by Group";
  if (path.startsWith("/jvm/requests")) return "Requests";

  // Import Payment routes
  if (
    path.startsWith("/import-payment/report/") &&
    path.split("/").length === 4
  ) {
    return "Report Details";
  }

  if (path === "/import-payment/report") {
    return "Reports";
  }
  if (
    path.startsWith("/import-payment/my-request/") &&
    path.split("/").length === 4
  ) {
    return "MY Report Details";
  }

  if (path === "/import-payment/my-request") {
    return "My Reports";
  }
  if (
    path.startsWith("/import-payment/upload/") &&
    path.split("/").length === 4
  ) {
    return "Upload Report Details";
  }

  if (path === "/import-payment/upload") {
    return "Upload Reports";
  }
  // if (path.startsWith("/import-payment/upload")) return "Upload";
  if (path.startsWith("/import-payment/master")) return "Master Data";
  if (path.startsWith("/import-payment/usermanagement")) return "User Management";
  if (path.startsWith("/import-payment/request")) return "Raise Request";
  if (path.startsWith("/import-payment/access-point")) return "Access Points";
  if (path.startsWith("/import-payment/hierarchy-flow")) return "Hierarchy Flow";
  // if (path.startsWith("/import-payment/report")) return "Report";
  // if (path.startsWith("/import-payment/report/")) return "Report Details";
  // if (path.startsWith("/import-payment/my-request")) return "";

  // Custom Duty routes
  if (path.startsWith("/custom-duty/raise-to-bank/submit-detail/")) return "Submit Detail";
  if (path.startsWith("/custom-duty/raise-to-bank")) return "Raise to Bank";
  if (path.startsWith("/custom-duty/requests")) return "Requests";
  if (path.startsWith("/custom-duty/my-requests")) return "My Requests";
  if (path.startsWith("/custom-duty/raise-request")) return "Raise Request";
  if (path.startsWith("/custom-duty/payment")) return "Payment";
  if (path.startsWith("/custom-duty/master")) return "Master Data";
  if (path.startsWith("/custom-duty/user-management")) return "User Management";
  if (path.startsWith("/custom-duty/hierarchy-management")) return "Hierarchy Management";

  // Petty Cash routes
  if (path.startsWith("/petty-cash/request")) return "Request";

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

