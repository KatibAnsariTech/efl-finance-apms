// eslint-disable-next-line perfectionist/sort-imports
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "src/layouts/dashboard";
import UserManagementView from "src/sections/usermanagement/view/usermanagement-view";
import { FormView } from "src/sections/forms/view";
import { ApprovalView } from "src/sections/approvals/view";
import { RaiseTicket } from "src/sections/raise-ticket/view";
import FormDetailsView from "src/sections/approvals/form-details/view/FormDetailsView";
import FormDetailsViewForm from "src/sections/forms/form-details/view/FormDetailsView";
import { MasterView } from "src/sections/master/view";
import IndexPage from "src/pages/app";
import LoginPage from "src/pages/login";
import OTPVerificationPage from "src/pages/otp-verification";
import ResetPasswordPage from "src/pages/reset-password";
import Page404 from "src/pages/page-not-found";
import { MasterSheetView } from "src/sections/master-sheet/view";
import navConfig from "src/layouts/dashboard/config-navigation";
import HierarchyManagementView from "src/sections/hierarchy-management/view/hierarchy-management-view";
import JVMPage from "src/pages/jvm";
import ImportPaymentPage from "src/pages/import-payment";
import CustomDutyPage from "src/pages/custom-duty";
import PettyCashPage from "src/pages/petty-cash";
import CreditDeviationPage from "src/pages/credit-deviation";
import CreditDeviationDashboard from "src/pages/credit-deviation-dashboard";
import JVMDashboard from "src/pages/jvm-dashboard";
import ImportPaymentDashboard from "src/pages/import-payment-dashboard";
import CustomDutyDashboard from "src/pages/custom-duty-dashboard";
import PettyCashDashboard from "src/pages/petty-cash-dashboard";
// JVM subpages
import JVStatusPage from "src/pages/jv-status";
import InitiateJVPage from "src/pages/initiate-jv";
import JVDetailPage from "src/pages/jv-detail";
// Import Payment subpages
import ImportPaymentUploadPage from "src/pages/import-payment-upload";
// Custom Duty subpages
import CustomDutyPaymentPage from "src/pages/custom-duty-payment";
// Petty Cash subpages
import PettyCashRequestPage from "src/pages/petty-cash-request";
import { RaiseRequest } from "src/features/custom-duty";
// Master Data subpages
// User Management subpages
// Hierarchy Management subpages
// import { RaiseTicket } from 'src/sections/raise-ticket/view';

// export const IndexPage = lazy(() => import("src/pages/app"));
// export const LoginPage = lazy(() => import("src/pages/login"));
// export const FormView = lazy(() =>
//   import("src/sections/forms/view/forms-view")
// );
// export const ApprovalView = lazy(() =>
//   import("src/sections/approvals/view/approval-view")
// );
// export const FormDetailsView = lazy(() =>
//   import("src/sections/approvals/form-details/view/FormDetailsView")
// );
// export const FormDetailsViewForm = lazy(() =>
//   import("src/sections/forms/form-details/view/FormDetailsView")
// );
// export const RaiseTicket = lazy(() =>
//   import("src/sections/raise-ticket/view/raise-ticket")
// );
// export const MasterView = lazy(() =>
//   import("src/sections/master/view/master-view")
// );
// export const Page404 = lazy(() => import("src/pages/page-not-found"));

export default function Router() {
  const isLoggedIn = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const isSAdmin = user?.userType === "SUPER_ADMIN";

  const AdminRoute = ({ children }) => {
    return isSAdmin ? children : <Navigate to="/" replace />;
  };

  // Helper to get allowed roles for a path from navConfig
  const getAllowedRoles = (path) => {
    const item = navConfig.find((nav) => nav.path === path);
    return item?.roles || [];
  };

  // Wrapper for role-based route protection
  const RoleRoute = ({ path, element }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const allowedRoles = getAllowedRoles(path);
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return element;
    }
    return <Page404 />;
  };

  const RoleBasedRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const firstAvailablePage = navConfig.find((nav) =>
      nav.roles.includes(userRole)
    );
    const redirectPath =
      firstAvailablePage?.path || "/credit-deviation/request";
    return <Navigate to={redirectPath} replace />;
  };

  const routes = useRoutes([
    {
      path: "/",
      element: isLoggedIn ? (
        <DashboardLayout>
          <Suspense>
            <ToastContainer />
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        // { index: true, element: <RoleBasedRedirect /> },

        {
          path: "/jvm",
          element: <RoleRoute path="/jvm" element={<JVMPage />} />,
        },
        {
          path: "/import-payment",
          element: (
            <RoleRoute path="/import-payment" element={<ImportPaymentPage />} />
          ),
        },
        {
          path: "/custom-duty",
          element: (
            <RoleRoute path="/custom-duty" element={<CustomDutyPage />} />
          ),
        },
        {
          path: "/petty-cash",
          element: <RoleRoute path="/petty-cash" element={<PettyCashPage />} />,
        },
        {
          path: "/credit-deviation",
          element: (
            <RoleRoute
              path="/credit-deviation"
              element={<CreditDeviationPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/dashboard",
          element: (
            <RoleRoute
              path="/credit-deviation/dashboard"
              element={<CreditDeviationDashboard />}
            />
          ),
        },
        {
          path: "/jvm/dashboard",
          element: (
            <RoleRoute path="/jvm/dashboard" element={<JVMDashboard />} />
          ),
        },
        {
          path: "/import-payment/dashboard",
          element: (
            <RoleRoute
              path="/import-payment/dashboard"
              element={<ImportPaymentDashboard />}
            />
          ),
        },
        {
          path: "/custom-duty/dashboard",
          element: (
            <RoleRoute
              path="/custom-duty/dashboard"
              element={<CustomDutyDashboard />}
            />
          ),
        },
        {
          path: "/petty-cash/dashboard",
          element: (
            <RoleRoute
              path="/petty-cash/dashboard"
              element={<PettyCashDashboard />}
            />
          ),
        },
        // Credit Deviation subpages
        {
          path: "/credit-deviation/request",
          element: (
            <RoleRoute
              path="/credit-deviation/request"
              element={<RaiseTicket />}
            />
          ),
        },
        {
          path: "/credit-deviation/request-status",
          element: (
            <RoleRoute
              path="/credit-deviation/request-status"
              element={<FormView />}
            />
          ),
        },
        {
          path: "/credit-deviation/approvals",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<ApprovalView />}
            />
          ),
        },
        {
          path: "/credit-deviation/master",
          element: (
            <RoleRoute
              path="/credit-deviation/master"
              element={<MasterView />}
            />
          ),
        },
        {
          path: "/credit-deviation/usermanagement",
          element: (
            <RoleRoute
              path="/credit-deviation/usermanagement"
              element={<UserManagementView />}
            />
          ),
        },
        {
          path: "/credit-deviation/master-sheet",
          element: (
            <RoleRoute
              path="/credit-deviation/master-sheet"
              element={<MasterSheetView />}
            />
          ),
        },
        {
          path: "/credit-deviation/hierarchy-management",
          element: (
            <RoleRoute
              path="/credit-deviation/hierarchy-management"
              element={<HierarchyManagementView />}
            />
          ),
        },
        {
          path: "credit-deviation/approvals/view/:id",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<FormDetailsView />}
            />
          ),
        },
        {
          path: "credit-deviation/request-status/view/:id",
          element: (
            <RoleRoute
              path="/credit-deviation/request-status"
              element={<FormDetailsViewForm />}
            />
          ),
        },
        // JVM subpages
        {
          path: "/jvm/jv-status",
          element: (
            <RoleRoute path="/jvm/jv-status" element={<JVStatusPage />} />
          ),
        },
        {
          path: "/jvm/initiate-jv",
          element: (
            <RoleRoute path="/jvm/initiate-jv" element={<InitiateJVPage />} />
          ),
        },
        {
          path: "/jvm/jv-status/jv-detail/:jvId",
          element: <JVDetailPage />,
        },
        // Import Payment subpages
        {
          path: "/import-payment/upload",
          element: (
            <RoleRoute
              path="/import-payment/upload"
              element={<ImportPaymentUploadPage />}
            />
          ),
        },
        // Custom Duty subpages
        {
          path: "/custom-duty/payment",
          element: (
            <RoleRoute
              path="/custom-duty/payment"
              element={<CustomDutyPaymentPage />}
            />
          ),
        },
        {
          path: "/custom-duty/raise-request",
          element: (
            <RoleRoute
              path="/custom-duty/raise-request"
              element={<RaiseRequest />}
            />
          ),
        },
        // Petty Cash subpages
        {
          path: "/petty-cash/request",
          element: (
            <RoleRoute
              path="/petty-cash/request"
              element={<PettyCashRequestPage />}
            />
          ),
        },
      ],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: "/otp-verification",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <OTPVerificationPage />
      ),
    },
    {
      path: "/reset-password",
      element: isLoggedIn ? <Navigate to="/" replace /> : <ResetPasswordPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
