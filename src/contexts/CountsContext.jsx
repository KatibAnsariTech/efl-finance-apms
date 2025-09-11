import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userRequest } from "src/requestMethod";

const CountsContext = createContext();

export const CountsProvider = ({ children }) => {
  const [approvalCount, setApprovalCount] = useState(0);
  const [clarificationCount, setClarificationCount] = useState(0);

  const fetchCounts = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      const res = await userRequest.get("/admin/getRequestFormCounts");
      setApprovalCount(res?.data?.data?.approvalCount || 0);
      setClarificationCount(res?.data?.data?.clarificationCount || 0);
    } catch (err) {
      setApprovalCount(0);
      setClarificationCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return (
    <CountsContext.Provider value={{ approvalCount, clarificationCount, refreshCounts: fetchCounts }}>
      {children}
    </CountsContext.Provider>
  );
};

export const useCounts = () => useContext(CountsContext); 