import * as yup from "yup";

// JV Entry validation schema
export const jvEntrySchema = yup.object().shape({
  slNo: yup
    .string()
    .required("Serial Number is required")
    .test("max-entries", "Serial number can contain up to 950 entries only", function(value) {
      if (!value) return true;
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return false;
      
      // Get existing data from context
      const { existingData = [], isEditMode = false, currentEntryId = null } = this.options.context || {};
      
      // Count existing entries with the same serial number
      const existingEntries = existingData.filter(entry => 
        entry.slNo === value && 
        (isEditMode ? entry._id !== currentEntryId : true)
      );
      
      return existingEntries.length < 950;
    }),
  documentType: yup.string().required("Document Type is required"),
  documentDate: yup.date().required("Document Date is required"),
  businessArea: yup
    .string()
    .required("Business Area is required")
    .matches(/^[A-Za-z0-9]{4}$/, "Business Area must be exactly 4 alphanumeric characters"),
  accountType: yup.string().required("Account Type is required"),
  postingKey: yup.string().required("Posting Key is required"),
  type: yup.string().required("Type is required"),
  vendorCustomerGLNumber: yup.string().required("Vendor/Customer/GL Number is required"),
  amount: yup
    .string()
    .required("Amount is required")
    .test("is-number", "Amount must be a valid number", (value) => {
      if (!value || value.trim() === "") return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test("decimal-places", "Amount must have maximum 2 decimal places", (value) => {
      if (!value || value.trim() === "") return false;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  assignment: yup
    .string()
    .required("Assignment is required")
    .max(25, "Assignment must not exceed 25 characters"),
  profitCenter: yup
    .string()
    .required("Profit Center is required")
    .matches(/^\d{6}$/, "Profit Center must be exactly 6 digits"),
  specialGLIndication: yup
    .string()
    .required("Special GL Indication is required")
    .length(1, "Special GL Indication must be exactly 1 character"),
  referenceNumber: yup.string().required("Reference Number is required"),
  remarks: yup
    .string()
    .required("Remarks is required")
    .max(50, "Remarks must not exceed 50 characters"),
  postingDate: yup.date().required("Posting Date is required"),
  vendorCustomerGLName: yup.string().required("Vendor/Customer/GL Name is required"),
  costCenter: yup
    .string()
    .required("Cost Center is required")
    .matches(/^\d{1,10}$/, "Cost Center must be 1-10 digits only"),
  personalNumber: yup
    .string()
    .required("Personal Number is required")
    .matches(/^\d{7}$/, "Personal Number must be exactly 7 digits"),
});

// Auto Reversal validation schema
export const autoReversalSchema = yup.object().shape({
  slNo: yup
    .string()
    .required("Serial Number is required")
    .test("max-entries", "Serial number can contain up to 950 entries only", function(value) {
      if (!value) return true;
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) return false;
      
      // Get existing data from context
      const { existingData = [], isEditMode = false, currentEntryId = null } = this.options.context || {};
      
      // Count existing entries with the same serial number
      const existingEntries = existingData.filter(entry => 
        entry.slNo === value && 
        (isEditMode ? entry._id !== currentEntryId : true)
      );
      
      return existingEntries.length < 950;
    }),
  documentType: yup.string().required("Document Type is required"),
  documentDate: yup.date().required("Document Date is required"),
  businessArea: yup
    .string()
    .required("Business Area is required")
    .matches(/^[A-Za-z0-9]{4}$/, "Business Area must be exactly 4 alphanumeric characters"),
  accountType: yup.string().required("Account Type is required"),
  postingKey: yup.string().required("Posting Key is required"),
  type: yup.string().required("Type is required"),
  vendorCustomerGLNumber: yup.string().required("Vendor/Customer/GL Number is required"),
  amount: yup
    .string()
    .required("Amount is required")
    .test("is-number", "Amount must be a valid number", (value) => {
      if (!value || value.trim() === "") return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test("decimal-places", "Amount must have maximum 2 decimal places", (value) => {
      if (!value || value.trim() === "") return false;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  assignment: yup
    .string()
    .required("Assignment is required")
    .max(25, "Assignment must not exceed 25 characters"),
  profitCenter: yup
    .string()
    .required("Profit Center is required")
    .matches(/^\d{6}$/, "Profit Center must be exactly 6 digits"),
  specialGLIndication: yup
    .string()
    .required("Special GL Indication is required")
    .length(1, "Special GL Indication must be exactly 1 character"),
  referenceNumber: yup.string().required("Reference Number is required"),
  remarks: yup
    .string()
    .required("Remarks is required")
    .max(50, "Remarks must not exceed 50 characters"),
  postingDate: yup.date().required("Posting Date is required"),
  vendorCustomerGLName: yup.string().required("Vendor/Customer/GL Name is required"),
  costCenter: yup
    .string()
    .required("Cost Center is required")
    .matches(/^\d{1,10}$/, "Cost Center must be 1-10 digits only"),
  personalNumber: yup
    .string()
    .required("Personal Number is required")
    .matches(/^\d{7}$/, "Personal Number must be exactly 7 digits"),
  reversalRemarks: yup.string().required("Reversal Remarks is required"),
  reversalPostingDate: yup.date().required("Reversal Posting Date is required"),
});

// Initiate JV request validation schema
export const initiateJVSchema = yup.object().shape({
  requestType: yup.string().required("Request Type is required"),
  autoReversal: yup.string().required("Auto-reversal selection is required"),
  reversalRemarks: yup.string().when("autoReversal", {
    is: "Yes",
    then: (schema) => schema.required("Reversal Remarks is required when Auto-reversal is Yes"),
    otherwise: (schema) => schema.optional(),
  }),
  postingDate: yup.date().required("Posting Date is required"),
  documentDate: yup.date().required("Document Date is required"),
  referenceNumber: yup.string().required("Reference Number is required"),
  remarks: yup
    .string()
    .required("Remarks is required")
    .max(200, "Remarks must not exceed 200 characters"),
});
