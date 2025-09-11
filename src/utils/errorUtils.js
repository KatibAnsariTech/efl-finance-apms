export const getErrorMessage = (error, fallbackMessage = "An error occurred. Please try again.") => {
  if (!error) {
    return fallbackMessage;
  }

  // Check for server response data
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Priority order for different error message fields
    if (responseData.message) {
      return responseData.message;
    }
    
    if (responseData.errors) {
      return responseData.errors;
    }
    
    if (responseData.error) {
      return responseData.error;
    }
    
    // Check for array of errors
    if (Array.isArray(responseData.errors)) {
      return responseData.errors.join(', ');
    }
    
    // Check for validation errors object
    if (responseData.errors && typeof responseData.errors === 'object') {
      const errorMessages = Object.values(responseData.errors).flat();
      return errorMessages.join(', ');
    }
  }
  
  // Check for direct error message
  if (error?.message) {
    return error.message;
  }
  
  // Check for status text
  if (error?.response?.statusText) {
    return error.response.statusText;
  }
  
  // Return fallback message
  return fallbackMessage;
};


export const showErrorMessage = (error, fallbackMessage, swal) => {
  const errorMessage = getErrorMessage(error, fallbackMessage);
  swal("Error", errorMessage, "error");
};
