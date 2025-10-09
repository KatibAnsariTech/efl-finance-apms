import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userRequest } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";

const CustomCountContext = createContext();

export const CustomCountProvider = ({ children }) => {
  const account = useAccount();
  const [customRequestCounts, setCustomRequestCounts] = useState({
    pendingWithMe: 0
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchCustomRequestCounts = useCallback(async () => {
    try {
      const response = await userRequest.get("custom/getRequestFormCounts");
      if (response.data.statusCode === 200) {
        const counts = response.data.data;
        setCustomRequestCounts({
          pendingWithMe: counts.approvalCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching custom request counts:', error);
      setCustomRequestCounts({
        pendingWithMe: 0
      });
    }
  }, []);

  const refreshCustomData = useCallback(async () => {
    await fetchCustomRequestCounts();
  }, [fetchCustomRequestCounts]);

  useEffect(() => {
    if (account && account.displayName && account.displayName.trim() !== "" && !hasInitialized) {
      const hasCustomAccess = account.accessibleProjects && account.accessibleProjects.some(project => 
        project === "CUSTOM" || project === "custom-duty" || 
        (typeof project === 'object' && (project.id === "CUSTOM" || project.projectId === "CUSTOM" || project.id === "custom-duty" || project.projectId === "custom-duty"))
      );
      
      if (hasCustomAccess) {
        fetchCustomRequestCounts();
        setHasInitialized(true);
      }
    }
  }, [account, hasInitialized, fetchCustomRequestCounts]);

  const value = {
    customRequestCounts,
    fetchCustomRequestCounts,
    refreshCustomData,
  };

  return (
    <CustomCountContext.Provider value={value}>
      {children}
    </CustomCountContext.Provider>
  );
};

export const useCustomCount = () => {
  const context = useContext(CustomCountContext);
  if (!context) {
    throw new Error('useCustomCount must be used within a CustomCountProvider');
  }
  return context;
};
