import { userRequest } from "src/requestMethod";
import { toast } from "react-toastify";

// Export getUser function for use across the application
export const getUser = async (token) => {
  try {
    const response = await userRequest.get("/admin/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response?.data?.data;

    if (user?.email && user?.username && user?.userRoles) {
      const processedUser = {
        ...user,
        // Create a map of projectType to userType for easier access
        projectRoles: user.userRoles.reduce((acc, role) => {
          acc[role.projectType] = role.userType;
          return acc;
        }, {}),
        // Get all project types user has access to
        accessibleProjects: user.userRoles.map(role => role.projectType)
      };

      localStorage.setItem(
        "user",
        JSON.stringify(processedUser)
      );
      
      return processedUser;
    } else {
      throw new Error("User data is incomplete");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.errors || "Failed to fetch user data.");
    throw error;
  }
};

// Function to refresh user data on page reload
export const refreshUserData = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      await getUser(token);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }
};
