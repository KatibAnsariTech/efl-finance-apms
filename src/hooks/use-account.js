import { useAccountContext } from "src/contexts/AccountContext";

export const useAccount = () => {
  const { account } = useAccountContext();
  return account;
};
