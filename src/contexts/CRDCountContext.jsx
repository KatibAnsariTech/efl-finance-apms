import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userRequest } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";

const CRDCountContext = createContext();

export const CRDCountProvider = ({ children }) => {
  const account = useAccount();
  const [approvalCount, setApprovalCount] = useState(0);
  const [clarificationCount, setClarificationCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await userRequest.get("/admin/getRequestFormCounts");
      setApprovalCount(res?.data?.data?.approvalCount || 0);
      setClarificationCount(res?.data?.data?.clarificationCount || 0);
    } catch (err) {
      setApprovalCount(0);
      setClarificationCount(0);
    }
  }, []);

  const refreshCounts = useCallback(async () => {
    setIsManualRefresh(true);
    await fetchCounts();
    setIsManualRefresh(false);
  }, [fetchCounts]);

  useEffect(() => {
    if (account && account.displayName && account.displayName.trim() !== "" && !hasInitialized && !isManualRefresh) {
      const hasCustomDutyAccess = account.accessibleProjects && account.accessibleProjects.some(project => 
        project === "CRD" || 
        (typeof project === 'object' && (project.id === "CRD" || project.projectId === "CRD"))
      );
      
      if (hasCustomDutyAccess) {
        fetchCounts();
      }
      setHasInitialized(true);
    }
  }, [account, hasInitialized, fetchCounts, isManualRefresh]);

  return (
    <CRDCountContext.Provider value={{ approvalCount, clarificationCount, refreshCounts }}>
      {children}
    </CRDCountContext.Provider>
  );
};

export const useCRDCount = () => useContext(CRDCountContext); 