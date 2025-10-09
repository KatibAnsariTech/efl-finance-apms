import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userRequest } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";

const JVMContext = createContext();

export const JVMProvider = ({ children }) => {
  const account = useAccount();
  const [jvmRequestCounts, setJvmRequestCounts] = useState({
    pendingWithMe: 0,
    active: 0
  });

  const fetchJVMRequestCounts = useCallback(async () => {
    try {
      const response = await userRequest.get("jvm/getRequestFormCounts");
      if (response.data.statusCode === 200) {
        const counts = response.data.data;
        setJvmRequestCounts({
          pendingWithMe: counts.approvalCount || 0,
          active: counts.reversalPendingCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching JVM request counts:', error);
      setJvmRequestCounts({
        pendingWithMe: 0,
        active: 0
      });
    }
  }, []);


  const refreshJVMData = useCallback(async () => {
    await fetchJVMRequestCounts();
  }, [fetchJVMRequestCounts]);

  useEffect(() => {
    if (account && account.displayName && account.displayName.trim() !== "") {
      refreshJVMData();
    }
  }, [refreshJVMData, account]);

  const value = {
    jvmRequestCounts,
    fetchJVMRequestCounts,
    refreshJVMData,
  };

  return (
    <JVMContext.Provider value={value}>
      {children}
    </JVMContext.Provider>
  );
};

export const useJVM = () => {
  const context = useContext(JVMContext);
  if (!context) {
    throw new Error('useJVM must be used within a JVMProvider');
  }
  return context;
};
