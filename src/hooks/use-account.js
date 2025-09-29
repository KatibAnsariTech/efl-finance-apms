export const useAccount = () => {
  const getInitialAccount = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return {
        ...user,
        photoURL: user.profileImg && user.profileImg.trim() !== "" ? user.profileImg : "/assets/eurekaforbes-icon.png",
        displayName: user.displayName || user.username || "User",
        accessibleProjects: user.accessibleProjects || [],
        projectRoles: user.projectRoles || {},
      };
    }
    return {
      displayName: "",
      email: "",
      photoURL: "/assets/eurekaforbes-icon.png",
      userRoles: [],
      accessibleProjects: [],
      projectRoles: {},
    };
  };
  const account = getInitialAccount();

  return account;
};
