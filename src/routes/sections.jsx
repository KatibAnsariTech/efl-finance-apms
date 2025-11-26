// eslint-disable-next-line perfectionist/sort-imports
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import Layout from "src/layouts";
import navConfig from "src/layouts/config/navConfig.jsx";
import { hasAccessToPath, getFirstAccessiblePath } from "src/layouts/config/accessControl";

// Lazy load all feature components
const IndexPage = lazy(() => import("src/features/app/pages/App"));
const ApplicationsDashboard = lazy(() =>
  import("src/features/app/components/ApplicationsDashboard")
);

const LoginPage = lazy(() => import("src/features/auth/pages/Login"));
const OTPVerificationPage = lazy(() =>
  import("src/features/auth/pages/OTPVerification")
);
const ResetPasswordPage = lazy(() =>
  import("src/features/auth/pages/ResetPassword")
);

const Page404 = lazy(() => import("src/features/error/pages/PageNotFound"));

const JVMPage = lazy(() => import("src/features/jvm/dashboard/pages/JVM"));
const JVMDashboard = lazy(() =>
  import("src/features/jvm/dashboard/components/JVMDashboard")
);
const RequestedJVPage = lazy(() =>
  import("src/features/jvm/requested-jv/pages/RequestedJV")
);
const InitiateJVPage = lazy(() =>
  import("src/features/jvm/initiate-jv/pages/InitiateJV")
);
const JVDetailPage = lazy(() =>
  import("src/features/jvm/requested-jv/pages/JVDetails")
);
const JVByRequestNoPage = lazy(() =>
  import("src/features/jvm/requested-jv/pages/JVByRequestNo")
);
const AutoReversalPage = lazy(() =>
  import("src/features/jvm/auto-reversal/pages/AutoReversal")
);
const AutoReversalDetailPage = lazy(() =>
  import("src/features/jvm/auto-reversal/pages/AutoReversalDetails")
);
const JVMMasterPage = lazy(() =>
  import("src/features/jvm/master/pages/JVMMaster")
);
const JVMUserManagementPage = lazy(() =>
  import("src/features/jvm/usermanagement/pages/UserManagement")
);
const JVMRequestsPage = lazy(() =>
  import("src/features/jvm/requests/pages/Requests")
);
const JVRequestDetailPage = lazy(() =>
  import("src/features/jvm/requests/pages/JVDetails")
);
const JVRequestByRequestNoPage = lazy(() =>
  import("src/features/jvm/requests/pages/JVByRequestNo")
);

const ImportPaymentPage = lazy(() =>
  import("src/features/import-payment/dashboard/pages/ImportPayment")
);
const ImportPaymentDashboard = lazy(() =>
  import(
    "src/features/import-payment/dashboard/components/ImportPaymentDashboard"
  )
);
const ImportPaymentUploadPage = lazy(() =>
  import("src/features/import-payment/upload/pages/ImportPaymentUpload")
);

const CustomDutyPage = lazy(() =>
  import("src/features/custom-duty/dashboard/pages/CustomDuty")
);
const CustomDutyDashboard = lazy(() =>
  import("src/features/custom-duty/dashboard/components/CustomDutyDashboard")
);
const RaiseRequest = lazy(() =>
  import("src/features/custom-duty/raise-request/pages/RaiseRequest")
);
const MyRequests = lazy(() =>
  import("src/features/custom-duty/my-requests/pages/MyRequests")
);
const Requests = lazy(() =>
  import("src/features/custom-duty/requests/pages/Requests")
);
const RaiseToBank = lazy(() =>
  import("src/features/custom-duty/raise-to-bank/pages/RaiseToBank")
);
const SubmitDetail = lazy(() =>
  import("src/features/custom-duty/raise-to-bank/pages/SubmitDetail")
);
const CustomDutyMaster = lazy(() =>
  import("src/features/custom-duty/master/pages/CustomDutyMaster")
);
const CustomDutyUserManagement = lazy(() =>
  import("src/features/custom-duty/user-management/pages/CustomDutyUserManagement")
);
const CustomDutyHierarchyManagement = lazy(() =>
  import("src/features/custom-duty/hierarchy-management/pages/HierarchyManagement")
);

const PettyCashPage = lazy(() =>
  import("src/features/petty-cash/dashboard/pages/PettyCash")
);
const PettyCashDashboard = lazy(() =>
  import("src/features/petty-cash/dashboard/components/PettyCashDashboard")
);
const PettyCashRequestPage = lazy(() =>
  import("src/features/petty-cash/request/pages/PettyCashRequest")
);

const CAPEXPage = lazy(() =>
  import("src/features/capex/dashboard/pages/CAPEX")
);
const CAPEXDashboard = lazy(() =>
  import("src/features/capex/dashboard/components/CAPEXDashboard")
);
const CAPEXMasterPage = lazy(() =>
  import("src/features/capex/master/pages/CAPEXMaster")
);
const RaiseRequestPage = lazy(() =>
  import("src/features/capex/raise-request/pages/RaiseRequest")
);
const CAPEXMyRequestsPage = lazy(() =>
  import("src/features/capex/my-requests/pages/MyRequests")
);
const CAPEXRequestsPage = lazy(() =>
  import("src/features/capex/requests/pages/Requests")
);

const SettingsPage = lazy(() => import("src/features/settings/pages/Settings"));
const ProfilePage = lazy(() => import("src/features/settings/pages/Profile"));
const AddUserPage = lazy(() => import("src/features/settings/pages/AddUser"));
const ChangePasswordPage = lazy(() =>
  import("src/features/settings/pages/ChangePassword")
);

const CreditDeviationPage = lazy(() =>
  import("src/features/credit-deviation/pages/CreditDeviation")
);
const CreditDeviationDashboard = lazy(() =>
  import(
    "src/features/credit-deviation/dashboard/components/CreditDeviationDashboard"
  )
);
const RequestPage = lazy(() =>
  import("src/features/credit-deviation/request/pages/Request")
);
const RequestStatusPage = lazy(() =>
  import("src/features/credit-deviation/request-status/pages/RequestStatus")
);
const ApprovalsPage = lazy(() =>
  import("src/features/credit-deviation/approvals/pages/Approvals")
);
const MasterPage = lazy(() =>
  import("src/features/credit-deviation/master/pages/Master")
);
const UserManagementPage = lazy(() =>
  import("src/features/credit-deviation/usermanagement/pages/UserManagement")
);
const MasterSheetPage = lazy(() =>
  import("src/features/credit-deviation/master-sheet/pages/MasterSheet")
);
const HierarchyManagementPage = lazy(() =>
  import(
    "src/features/credit-deviation/hierarchy-management/pages/HierarchyManagement"
  )
);
const FormDetailsPage = lazy(() =>
  import(
    "src/features/credit-deviation/approvals/pages/form-details/FormDetails"
  )
);
const FormDetailsViewForm = lazy(() =>
  import(
    "src/features/credit-deviation/request-status/components/form-details/FormDetailsView"
  )
);

export default function Router() {
  const isLoggedIn = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Check if user has SUPER_ADMIN role in any project
  const isSAdmin = user?.userRoles?.some(role => role.userType === "SUPER_ADMIN") || 
                   Object.values(user?.projectRoles || {}).includes("SUPER_ADMIN");

  const AdminRoute = ({ children }) => {
    return isSAdmin ? children : <Navigate to="/" replace />;
  };

  // Helper to get allowed roles for a path from navConfig (legacy)
  const getAllowedRoles = (path) => {
    // This would need to be updated to work with the new project structure
    // For now, return empty array to allow access (will be filtered by navigation)
    return [];
  };

  // Protected route wrapper that checks URL access
  const ProtectedRoute = ({ path, element }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (hasAccessToPath(path, user)) {
      return element;
    }
    
    // Show 404 page if user doesn't have access
    return <Page404 />;
  };


  const RoleBasedRedirect = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Get the first accessible path for the user
    const redirectPath = getFirstAccessiblePath(user);
    
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
          element: <ProtectedRoute path="/jvm" element={<JVMPage />} />,
        },
        {
          path: "/import-payment",
          element: (
            <ProtectedRoute path="/import-payment" element={<ImportPaymentPage />} />
          ),
        },
        {
          path: "/custom-duty",
          element: (
            <ProtectedRoute path="/custom-duty" element={<CustomDutyPage />} />
          ),
        },
        {
          path: "/petty-cash",
          element: <ProtectedRoute path="/petty-cash" element={<PettyCashPage />} />,
        },
        {
          path: "/capex",
          element: <ProtectedRoute path="/capex" element={<CAPEXPage />} />,
        },
        {
          path: "/credit-deviation",
          element: (
            <ProtectedRoute
              path="/credit-deviation"
              element={<CreditDeviationPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/dashboard",
          element: (
            <ProtectedRoute
              path="/credit-deviation/dashboard"
              element={<CreditDeviationDashboard />}
            />
          ),
        },
        {
          path: "/jvm/dashboard",
          element: (
            <ProtectedRoute path="/jvm/dashboard" element={<JVMDashboard />} />
          ),
        },
        {
          path: "/import-payment/dashboard",
          element: (
            <ProtectedRoute
              path="/import-payment/dashboard"
              element={<ImportPaymentDashboard />}
            />
          ),
        },
        {
          path: "/custom-duty/dashboard",
          element: (
            <ProtectedRoute
              path="/custom-duty/dashboard"
              element={<CustomDutyDashboard />}
            />
          ),
        },
        {
          path: "/petty-cash/dashboard",
          element: (
            <ProtectedRoute
              path="/petty-cash/dashboard"
              element={<PettyCashDashboard />}
            />
          ),
        },
        {
          path: "/capex/dashboard",
          element: (
            <ProtectedRoute
              path="/capex/dashboard"
              element={<CAPEXDashboard />}
            />
          ),
        },
        // Credit Deviation subpages
        {
          path: "/credit-deviation/request",
          element: (
            <ProtectedRoute
              path="/credit-deviation/request"
              element={<RequestPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/request-status",
          element: (
            <ProtectedRoute
              path="/credit-deviation/request-status"
              element={<RequestStatusPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/approvals",
          element: (
            <ProtectedRoute
              path="/credit-deviation/approvals"
              element={<ApprovalsPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/master",
          element: (
            <ProtectedRoute
              path="/credit-deviation/master"
              element={<MasterPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/usermanagement",
          element: (
            <ProtectedRoute
              path="/credit-deviation/usermanagement"
              element={<UserManagementPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/master-sheet",
          element: (
            <ProtectedRoute
              path="/credit-deviation/master-sheet"
              element={<MasterSheetPage />}
            />
          ),
        },
        {
          path: "/credit-deviation/hierarchy-management",
          element: (
            <ProtectedRoute
              path="/credit-deviation/hierarchy-management"
              element={<HierarchyManagementPage />}
            />
          ),
        },
        {
          path: "credit-deviation/approvals/view/:id",
          element: (
            <ProtectedRoute
              path="/credit-deviation/approvals"
              element={<FormDetailsPage />}
            />
          ),
        },
        {
          path: "credit-deviation/request-status/view/:id",
          element: (
            <ProtectedRoute
              path="/credit-deviation/request-status"
              element={<FormDetailsViewForm />}
            />
          ),
        },
        // JVM subpages
        {
          path: "/jvm/initiate-jv",
          element: (
            <ProtectedRoute path="/jvm/initiate-jv" element={<InitiateJVPage />} />
          ),
        },
        {
          path: "/jvm/requested-jvs",
          element: (
            <ProtectedRoute path="/jvm/requested-jvs" element={<RequestedJVPage />} />
          ),
        },
        {
          path: "/jvm/requested-jvs/:parentId",
          element: (
            <ProtectedRoute path="/jvm/requested-jvs" element={<JVByRequestNoPage />} />
          ),
        },
        {
          path: "/jvm/auto-reversal",
          element: (
            <ProtectedRoute
              path="/jvm/auto-reversal"
              element={<AutoReversalPage />}
            />
          ),
        },
        {
          path: "/jvm/master",
          element: (
            <ProtectedRoute
              path="/jvm/master"
              element={<JVMMasterPage />}
            />
          ),
        },
        {
          path: "/jvm/usermanagement",
          element: (
            <ProtectedRoute
              path="/jvm/usermanagement"
              element={<JVMUserManagementPage />}
            />
          ),
        },
        {
          path: "/jvm/requests",
          element: (
            <ProtectedRoute
              path="/jvm/requests"
              element={<JVMRequestsPage />}
            />
          ),
        },
        {
          path: "/jvm/requests/:parentId",
          element: (
            <ProtectedRoute
              path="/jvm/requests"
              element={<JVRequestByRequestNoPage />}
            />
          ),
        },
        {
          path: "/jvm/requests/:parentId/:groupId",
          element: (
            <ProtectedRoute
              path="/jvm/requests"
              element={<JVRequestDetailPage />}
            />
          ),
        },
        {
          path: "/jvm/requested-jvs/:parentId/:groupId",
          element: (
            <ProtectedRoute
              path="/jvm/requested-jvs"
              element={<JVDetailPage />}
            />
          ),
        },
        {
          path: "/jvm/auto-reversal/ar-detail/:arId",
          element: <AutoReversalDetailPage />,
        },
        // Import Payment subpages
        {
          path: "/import-payment/upload",
          element: (
            <ProtectedRoute
              path="/import-payment/upload"
              element={<ImportPaymentUploadPage />}
            />
          ),
        },
        // Custom Duty subpages
        {
          path: "/custom-duty/raise-request",
          element: (
            <ProtectedRoute
              path="/custom-duty/raise-request"
              element={<RaiseRequest />}
            />
          ),
        },
        {
          path: "/custom-duty/my-requests",
          element: (
            <ProtectedRoute
              path="/custom-duty/my-requests"
              element={<MyRequests />}
            />
          ),
        },
        {
          path: "/custom-duty/requests",
          element: (
            <ProtectedRoute path="/custom-duty/requests" element={<Requests />} />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank",
          element: (
            <ProtectedRoute
              path="/custom-duty/raise-to-bank"
              element={<RaiseToBank />}
            />
          ),
        },
        {
          path: "/custom-duty/raise-to-bank/submit-detail/:finalRequestNo",
          element: (
            <ProtectedRoute
              path="/custom-duty/raise-to-bank"
              element={<SubmitDetail />}
            />
          ),
        },
        {
          path: "/custom-duty/master",
          element: (
            <ProtectedRoute
              path="/custom-duty/master"
              element={<CustomDutyMaster />}
            />
          ),
        },
        {
          path: "/custom-duty/user-management",
          element: (
            <ProtectedRoute
              path="/custom-duty/user-management"
              element={<CustomDutyUserManagement />}
            />
          ),
        },
        {
          path: "/custom-duty/hierarchy-management",
          element: (
            <ProtectedRoute
              path="/custom-duty/hierarchy-management"
              element={<CustomDutyHierarchyManagement />}
            />
          ),
        },
        // Petty Cash subpages
        {
          path: "/petty-cash/request",
          element: (
            <ProtectedRoute
              path="/petty-cash/request"
              element={<PettyCashRequestPage />}
            />
          ),
        },
        // CAPEX subpages
        {
          path: "/capex/master",
          element: (
            <ProtectedRoute
              path="/capex/master"
              element={<CAPEXMasterPage />}
            />
          ),
        },
        {
          path: "/capex/raise-request",
          element: (
            <ProtectedRoute
              path="/capex/raise-request"
              element={<RaiseRequestPage />}
            />
          ),
        },
        {
          path: "/capex/my-requests",
          element: (
            <ProtectedRoute
              path="/capex/my-requests"
              element={<CAPEXMyRequestsPage />}
            />
          ),
        },
        {
          path: "/capex/requests",
          element: (
            <ProtectedRoute
              path="/capex/requests"
              element={<CAPEXRequestsPage />}
            />
          ),
        },
        // Settings pages
        {
          path: "/settings",
          element: <ProtectedRoute path="/settings" element={<SettingsPage />} />,
        },
        {
          path: "/settings/profile",
          element: (
            <ProtectedRoute path="/settings/profile" element={<ProfilePage />} />
          ),
        },
        {
          path: "/settings/change-password",
          element: (
            <ProtectedRoute
              path="/settings/change-password"
              element={<ChangePasswordPage />}
            />
          ),
        },
        {
          path: "/settings/add-user",
          element: (
            <ProtectedRoute path="/settings/add-user" element={<AddUserPage />} />
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
