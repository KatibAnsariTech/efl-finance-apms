// eslint-disable-next-line perfectionist/sort-imports
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import Layout from "src/layouts";
import navConfig from "src/layouts/config/navigation";

// Lazy load all feature components
const IndexPage = lazy(() => import("src/features/app/pages/App"));
const ApplicationsDashboard = lazy(() => import("src/features/app/components/ApplicationsDashboard"));

const LoginPage = lazy(() => import("src/features/auth/pages/Login"));
const OTPVerificationPage = lazy(() => import("src/features/auth/pages/OTPVerification"));
const ResetPasswordPage = lazy(() => import("src/features/auth/pages/ResetPassword"));

const Page404 = lazy(() => import("src/features/error/pages/PageNotFound"));

const JVMPage = lazy(() => import("src/features/jvm/dashboard/pages/JVM"));
const JVMDashboard = lazy(() => import("src/features/jvm/dashboard/components/JVMDashboard"));
const JVStatusPage = lazy(() => import("src/features/jvm/jvs-status/pages/JVStatus"));
const InitiateJVPage = lazy(() => import("src/features/jvm/initiate-jv/pages/InitiateJV"));
const JVDetailPage = lazy(() => import("src/features/jvm/jvs-status/pages/JVDetails"));

const ImportPaymentPage = lazy(() => import("src/features/import-payment/dashboard/pages/ImportPayment"));
const ImportPaymentDashboard = lazy(() => import("src/features/import-payment/dashboard/components/ImportPaymentDashboard"));
const ImportPaymentUploadPage = lazy(() => import("src/features/import-payment/upload/pages/ImportPaymentUpload"));

const CustomDutyPage = lazy(() => import("src/features/custom-duty/dashboard/pages/CustomDuty"));
const CustomDutyDashboard = lazy(() => import("src/features/custom-duty/dashboard/components/CustomDutyDashboard"));
const RaiseRequest = lazy(() => import("src/features/custom-duty/raise-request/pages/RaiseRequest"));
const MyRequests = lazy(() => import("src/features/custom-duty/my-requests/pages/MyRequests"));
const Requests = lazy(() => import("src/features/custom-duty/requests/pages/Requests"));
const RaiseToBank = lazy(() => import("src/features/custom-duty/raise-to-bank/pages/RaiseToBank"));
const SubmitDetail = lazy(() => import("src/features/custom-duty/raise-to-bank/pages/SubmitDetail"));
const CustomDutyMaster = lazy(() => import("src/features/custom-duty/master/pages/CustomDutyMaster"));

const PettyCashPage = lazy(() => import("src/features/petty-cash/dashboard/pages/PettyCash"));
const PettyCashDashboard = lazy(() => import("src/features/petty-cash/dashboard/components/PettyCashDashboard"));
const PettyCashRequestPage = lazy(() => import("src/features/petty-cash/request/pages/PettyCashRequest"));

const CreditDeviationPage = lazy(() => import("src/features/credit-deviation/pages/CreditDeviation"));
const CreditDeviationDashboard = lazy(() => import("src/features/credit-deviation/dashboard/components/CreditDeviationDashboard"));
const RequestPage = lazy(() => import("src/features/credit-deviation/request/pages/Request"));
const RequestStatusPage = lazy(() => import("src/features/credit-deviation/request-status/pages/RequestStatus"));
const ApprovalsPage = lazy(() => import("src/features/credit-deviation/approvals/pages/Approvals"));
const MasterPage = lazy(() => import("src/features/credit-deviation/master/pages/Master"));
const UserManagementPage = lazy(() => import("src/features/credit-deviation/usermanagement/pages/UserManagement"));
const MasterSheetPage = lazy(() => import("src/features/credit-deviation/master-sheet/pages/MasterSheet"));
const HierarchyManagementPage = lazy(() => import("src/features/credit-deviation/hierarchy-management/pages/HierarchyManagement"));
const FormDetailsPage = lazy(() => import("src/features/credit-deviation/approvals/pages/form-details/FormDetails"));
const FormDetailsViewForm = lazy(() => import("src/features/credit-deviation/request-status/components/form-details/FormDetailsView"));


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
        <Layout>
        <Suspense>
          <ToastContainer />
          <Outlet />
        </Suspense>
        </Layout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },

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
              element={<RequestPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/request-status",
          element: (
            <RoleRoute
              path="/credit-deviation/request-status"
              element={<RequestStatusPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/approvals",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<ApprovalsPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/master",
          element: (
            <RoleRoute
              path="/credit-deviation/master"
              element={<MasterPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/usermanagement",
          element: (
            <RoleRoute
              path="/credit-deviation/usermanagement"
              element={<UserManagementPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/master-sheet",
          element: (
            <RoleRoute
              path="/credit-deviation/master-sheet"
              element={<MasterSheetPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/hierarchy-management",
          element: (
            <RoleRoute
              path="/credit-deviation/hierarchy-management"
              element={<HierarchyManagementPage />}
            />
          ),
        },
        {
          path: "credit-deviation/approvals/view/:id",
          element: (
            <RoleRoute
              path="/credit-deviation/approvals"
              element={<FormDetailsPage />}
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
          path: "/jvm/initiate-jv",
          element: (
            <RoleRoute path="/jvm/initiate-jv" element={<InitiateJVPage />} />
          ),
        },
        {
          path: "/jvm/jv-status",
          element: (
            <RoleRoute path="/jvm/jv-status" element={<JVStatusPage />} />
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
          path: "/custom-duty/raise-request",
          element: (
            <RoleRoute
              path="/custom-duty/raise-request"
              element={<RaiseRequest />}
            />
          ),
        },
        {
          path: "/custom-duty/my-requests",
          element: (
            <RoleRoute
              path="/custom-duty/my-requests"
              element={<MyRequests />}
            />
          ),
        },
        {
          path: "/custom-duty/requests",
          element: (
            <RoleRoute path="/custom-duty/requests" element={<Requests />} />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank",
          element: (
            <RoleRoute
              path="/custom-duty/raise-to-bank"
              element={<RaiseToBank />}
            />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank/submit-detail/:id",
          element: (
            <RoleRoute
              path="/custom-duty/raise-to-bank/submit-detail/:id"
              element={<SubmitDetail />}
            />
          ),
        },
        {
          path: "/custom-duty/master",
          element: (
            <RoleRoute
              path="/custom-duty/master"
              element={<CustomDutyMaster />}
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
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Suspense>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "/otp-verification",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Suspense>
          <OTPVerificationPage />
        </Suspense>
      ),
    },
    {
      path: "/reset-password",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Suspense>
          <ResetPasswordPage />
        </Suspense>
      ),
    },
    {
      path: "404",
      element: (
        <Suspense>
          <Page404 />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
