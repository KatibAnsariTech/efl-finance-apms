import { useCallback } from 'react';
import { useJVM } from 'src/contexts/JVMContext';
import { useCustomCount } from 'src/contexts/CustomCountContext';
import { refreshUserCounts } from 'src/utils/countRefreshUtils';

export const useCountRefresh = () => {
  const { refreshJVMData } = useJVM();
  const { refreshCustomData } = useCustomCount();

  const refreshFunctions = {
    JVM: refreshJVMData,
    CUSTOM: refreshCustomData,
  };

  const refreshUserCountsForUser = useCallback(
    async (user) => {
      return await refreshUserCounts(user, refreshFunctions);
    },
    [refreshJVMData, refreshCustomData]
  );

  return {
    refreshUserCounts: refreshUserCountsForUser,
    refreshFunctions,
  };
};

export const useCountRefreshWithCustomFunctions = (customRefreshFunctions) => {
  const refreshUserCountsForUser = useCallback(
    async (user) => {
      return await refreshUserCounts(user, customRefreshFunctions);
    },
    [customRefreshFunctions]
  );

  return {
    refreshUserCounts: refreshUserCountsForUser,
    refreshFunctions: customRefreshFunctions,
  };
};

export default useCountRefresh;
