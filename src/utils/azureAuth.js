import { publicRequest, setTokens } from '../requestMethod';
import { getUser } from './userUtils';
import { BACKEND_URL } from '../config/config';

/**
 * Initiate Azure SSO login via backend
 * Redirects to backend endpoint which handles Azure authentication
 * 
 * IMPORTANT: Backend MUST return HTTP redirect (302/301) to Azure AD, NOT JSON
 * Backend should include prompt=select_account in Azure AD authorization URL to show account selection
 */
export const initiateAzureLogin = () => {
  const redirectUri = `${window.location.origin}/azure-redirect`;
  // Pass prompt parameter to backend so it can include it in Azure AD URL
  const loginUrl = `${BACKEND_URL}/auth/azure/login?redirectUri=${encodeURIComponent(redirectUri)}&prompt=select_account`;
  
  // Direct redirect to backend - backend should redirect to Azure AD
  // If backend returns JSON instead of redirecting, it will show in browser (backend issue)
  window.location.href = loginUrl;
};

/**
 * Validate Azure token with backend
 * @param {string} azureToken - Azure AD access token
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const validateAzureToken = async (azureToken, onSuccess, onError) => {
  try {
    // Call backend to validate the Azure token
    const response = await publicRequest.post('/auth/azure/validate', {
      azureToken: azureToken,
    });

    const token = response.data.data?.token || response.data.token || response.data.data;
    
    if (token) {
      setTokens(token);
      const user = await getUser(token);
      
      if (onSuccess) {
        onSuccess(user);
      }
    } else {
      throw new Error('No token received from backend');
    }
  } catch (error) {
    console.error('Token validation error:', error);
    // Pass the error to the callback so it can be handled with toast
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
  }
};

