import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const getAccountData = useCallback(() => {
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
  }, []);

  const [account, setAccount] = useState(getAccountData);

  const refreshAccount = useCallback(() => {
    setAccount(getAccountData());
  }, [getAccountData]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAccount(getAccountData());
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [getAccountData]);

  const value = {
    account,
    refreshAccount,
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
};
