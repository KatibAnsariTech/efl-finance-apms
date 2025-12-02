import * as yup from "yup";

const fileUploadSchema = yup
  .array()
  .of(yup.mixed())
  .min(1, "Please upload at least one document")
  .required("Upload is required");

export const importPaymentRequestSchema = yup.object().shape({
  assignedDepartment: yup.string().required("Assigned Department is required"),
  typeOfImport: yup.string().required("Type of Import is required"),
  department: yup.string().required("Department is required"),
  scope: yup.string().required("Scope is required"),
  selectType: yup.string().required("Select Type is required"),
  poDate: yup.date().nullable().required("PO Date is required"),
  poNumber: yup.string().required("PO Number is required"),
  partyName: yup.string().required("Party Name is required"),
  grnDate: yup.date().nullable(),
  poAmount: yup
    .number()
    .typeError("PO Amount must be a number")
    .min(0, "PO Amount cannot be negative")
    .required("PO Amount is required"),
  currencyType: yup.string().required("Currency Type is required"),
  advanceAmount: yup
    .number()
    .typeError("Advance Amount must be a number")
    .min(0, "Advance Amount cannot be negative")
    .required("Advance Amount is required"),
  advancePercentage: yup
    .number()
    .typeError("Advance Percentage must be a number")
    .min(0, "Advance Percentage cannot be negative")
    .max(100, "Advance Percentage cannot exceed 100")
    .required("Advance Percentage is required"),
  paymentTerms: yup.string().required("Payment Terms are required"),
  poUpload: fileUploadSchema.label("PO Upload"),
  piUpload: fileUploadSchema.label("PI Upload"),
});

