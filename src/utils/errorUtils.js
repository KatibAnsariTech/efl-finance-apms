export const getErrorMessage = (error, fallbackMessage = "An error occurred. Please try again.") => {
  if (!error) {
    return fallbackMessage;
  }

  if (error?.response?.data) {
    const responseData = error.response.data;
    
    if (responseData.message) {
      return responseData.message;
    }
    
    if (responseData.errors) {
      return responseData.errors;
    }
    
    if (responseData.error) {
      return responseData.error;
    }
    
    if (Array.isArray(responseData.errors)) {
      return responseData.errors.join(', ');
    }
    
    if (responseData.errors && typeof responseData.errors === 'object') {
      const errorMessages = Object.values(responseData.errors).flat();
      return errorMessages.join(', ');
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.response?.statusText) {
    return error.response.statusText;
  }
  
  return fallbackMessage;
};


export const showErrorMessage = (error, fallbackMessage, swal) => {
  const errorMessage = getErrorMessage(error, fallbackMessage);
  swal("Error", errorMessage, "error");
};
