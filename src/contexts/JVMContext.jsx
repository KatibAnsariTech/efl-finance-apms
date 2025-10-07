import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userRequest } from "src/requestMethod";

const JVMContext = createContext();

export const JVMProvider = ({ children }) => {
  const [jvmRequestCounts, setJvmRequestCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    submitted: 0,
    total: 0
  });

  const [autoReversalCounts, setAutoReversalCounts] = useState({
    active: 0,
    completed: 0,
    failed: 0,
    total: 0
  });

  const [jvmRequests, setJvmRequests] = useState([]);
  const [jvmRequestsLoading, setJvmRequestsLoading] = useState(false);

  const [autoReversals, setAutoReversals] = useState([]);
  const [autoReversalsLoading, setAutoReversalsLoading] = useState(false);

  const generateFakeJVMRequests = useCallback(() => {
    const statuses = ['pending', 'approved', 'rejected', 'draft', 'submitted'];
    const fakeRequests = [];
    
    const pendingCount = 3;
    const otherCount = 22;
    
    for (let i = 1; i <= pendingCount; i++) {
      fakeRequests.push({
        _id: `jvm-pending-${i}`,
        requestNo: `JVM-${String(i).padStart(4, '0')}`,
        requestedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        amount: Math.floor(Math.random() * 100000) + 10000,
        description: `JVM Request ${i} - pending`,
        company: `Company ${Math.floor(Math.random() * 5) + 1}`,
        createdBy: `User ${Math.floor(Math.random() * 10) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    for (let i = pendingCount + 1; i <= pendingCount + otherCount; i++) {
      const status = statuses[Math.floor(Math.random() * (statuses.length - 1)) + 1];
      fakeRequests.push({
        _id: `jvm-${i}`,
        requestNo: `JVM-${String(i).padStart(4, '0')}`,
        requestedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
        amount: Math.floor(Math.random() * 100000) + 10000,
        description: `JVM Request ${i} - ${status}`,
        company: `Company ${Math.floor(Math.random() * 5) + 1}`,
        createdBy: `User ${Math.floor(Math.random() * 10) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    return fakeRequests;
  }, []);

  const generateFakeAutoReversals = useCallback(() => {
    const statuses = ['active', 'completed', 'failed'];
    const fakeReversals = [];
    
    const activeCount = 2;
    const otherCount = 13;
    
    for (let i = 1; i <= activeCount; i++) {
      fakeReversals.push({
        _id: `ar-active-${i}`,
        requestNo: `AR-${String(i).padStart(4, '0')}`,
        requestedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        amount: Math.floor(Math.random() * 50000) + 5000,
        description: `Auto Reversal ${i} - active`,
        company: `Company ${Math.floor(Math.random() * 5) + 1}`,
        createdBy: `User ${Math.floor(Math.random() * 10) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    for (let i = activeCount + 1; i <= activeCount + otherCount; i++) {
      const status = statuses[Math.floor(Math.random() * (statuses.length - 1)) + 1];
      fakeReversals.push({
        _id: `ar-${i}`,
        requestNo: `AR-${String(i).padStart(4, '0')}`,
        requestedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
        amount: Math.floor(Math.random() * 50000) + 5000,
        description: `Auto Reversal ${i} - ${status}`,
        company: `Company ${Math.floor(Math.random() * 5) + 1}`,
        createdBy: `User ${Math.floor(Math.random() * 10) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    return fakeReversals;
  }, []);

  const calculateJVMCounts = useCallback((requests) => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      draft: 0,
      submitted: 0,
      total: requests.length
    };

    requests.forEach(request => {
      const status = request.status?.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  }, []);

  const calculateAutoReversalCounts = useCallback((reversals) => {
    const counts = {
      active: 0,
      completed: 0,
      failed: 0,
      total: reversals.length
    };

    reversals.forEach(reversal => {
      const status = reversal.status?.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  }, []);

  const fetchJVMRequests = useCallback(async (params = {}) => {
    setJvmRequestsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fakeData = generateFakeJVMRequests();
      
      let filteredData = fakeData;
      if (params.status) {
        filteredData = fakeData.filter(item => 
          item.status.toLowerCase() === params.status.toLowerCase()
        );
      }
      if (params.search) {
        filteredData = filteredData.filter(item =>
          item.requestNo.toLowerCase().includes(params.search.toLowerCase()) ||
          item.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      setJvmRequests(filteredData);
      setJvmRequestCounts(calculateJVMCounts(fakeData));
      
      return {
        data: filteredData,
        totalCount: filteredData.length,
        counts: calculateJVMCounts(fakeData)
      };
    } catch (error) {
      console.error('Error fetching JVM requests:', error);
      setJvmRequests([]);
      setJvmRequestCounts({
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0,
        submitted: 0,
        total: 0
      });
      throw error;
    } finally {
      setJvmRequestsLoading(false);
    }
  }, [generateFakeJVMRequests, calculateJVMCounts]);

  const fetchAutoReversals = useCallback(async (params = {}) => {
    setAutoReversalsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const fakeData = generateFakeAutoReversals();
      
      let filteredData = fakeData;
      if (params.status) {
        filteredData = fakeData.filter(item => 
          item.status.toLowerCase() === params.status.toLowerCase()
        );
      }
      if (params.search) {
        filteredData = filteredData.filter(item =>
          item.requestNo.toLowerCase().includes(params.search.toLowerCase()) ||
          item.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      setAutoReversals(filteredData);
      setAutoReversalCounts(calculateAutoReversalCounts(fakeData));
      
      return {
        data: filteredData,
        totalCount: filteredData.length,
        counts: calculateAutoReversalCounts(fakeData)
      };
    } catch (error) {
      console.error('Error fetching auto reversals:', error);
      setAutoReversals([]);
      setAutoReversalCounts({
        active: 0,
        completed: 0,
        failed: 0,
        total: 0
      });
      throw error;
    } finally {
      setAutoReversalsLoading(false);
    }
  }, [generateFakeAutoReversals, calculateAutoReversalCounts]);

  const refreshJVMData = useCallback(async () => {
    await Promise.all([
      fetchJVMRequests(),
      fetchAutoReversals()
    ]);
  }, [fetchJVMRequests, fetchAutoReversals]);

  useEffect(() => {
    refreshJVMData();
  }, [refreshJVMData]);

  const value = {
    jvmRequests,
    jvmRequestsLoading,
    jvmRequestCounts,
    fetchJVMRequests,
    autoReversals,
    autoReversalsLoading,
    autoReversalCounts,
    fetchAutoReversals,
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
