import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateAzureToken } from 'src/utils/azureAuth';
import { setTokens } from 'src/requestMethod';
import { getUser } from 'src/utils/userUtils';
import { useCountRefresh } from 'src/hooks/useCountRefresh';
import { useAccountContext } from 'src/contexts/AccountContext';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Component to handle Azure AD redirect callback from backend
 * Backend redirects here after processing Azure callback
 */
export default function AzureRedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUserCounts } = useCountRefresh();
  const { refreshAccount } = useAccountContext();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get token or code from URL query parameters (set by backend)
        const token = searchParams.get('token');
        const azureToken = searchParams.get('azureToken');
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle errors from backend
        if (error) {
          const errorMessage = errorDescription || error || 'Authentication failed';
          console.error('Azure authentication error:', error, errorDescription);
          toast.error(errorMessage);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1000);
          return;
        }

        // If backend already provided the app token, use it directly
        if (token) {
          try {
            setTokens(token);
            const user = await getUser(token);
            
            refreshAccount();
            await refreshUserCounts(user);
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, '/azure-redirect');
            toast.success('Login successful!');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1000);
          } catch (tokenError) {
            console.error('Error setting token:', tokenError);
            const errorMessage = tokenError.response?.data?.message || 
                                tokenError.response?.data?.errors || 
                                tokenError.message || 
                                'Failed to authenticate. Please try again.';
            toast.error(errorMessage);
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 1000);
          }
          return;
        }

        // If backend provided Azure token, validate it
        if (azureToken) {
          await validateAzureToken(
            azureToken,
            async (user) => {
              refreshAccount();
              await refreshUserCounts(user);
              window.history.replaceState({}, document.title, '/azure-redirect');
              toast.success('Login successful!');
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 1000);
            },
            (error) => {
              console.error('Token validation error:', error);
              const errorMessage = error.response?.data?.message || 
                                  error.response?.data?.errors || 
                                  error.message || 
                                  'Failed to validate authentication token. Please try again.';
              toast.error(errorMessage);
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 1000);
            }
          );
          return;
        }

        // If there's a code, backend should have handled it
        // If we reach here, something went wrong
        if (code) {
          console.warn('Received code but no token. Backend may not have processed it correctly.');
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1000);
          return;
        }

        // No token, code, or error - check if already logged in
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          navigate('/', { replace: true });
        } else {
          toast.error('No authentication data received. Please try again.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.error('Redirect handler error:', error);
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.errors || 
                            error.message || 
                            'An error occurred during authentication. Please try again.';
        toast.error(errorMessage);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);
      }
    };

    handleRedirect();
  }, [searchParams, navigate, refreshAccount, refreshUserCounts]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Completing authentication...
      </Typography>
    </Box>
  );
}

