import * as yup from "yup";

export const apmsSubmitSchema = yup.object({
  advanceType: yup.string().required("Form type is required"),

  // Common
  proposedSpoc: yup.string().required(),
  documents: yup.array(),

  // PETTY CASH
  invoiceNo: yup.string().when("advanceType", {
    is: "PETTY_CASH",
    then: (s) => s.required("Invoice No required"),
  }),

  // NON-PO
  vendorCode: yup.string().when("advanceType", {
    is: "NON_PO",
    then: (s) => s.required("Vendor / Employee code required"),
  }),

  // ADHOC
  reasonForAdvance: yup.string().when("advanceType", {
    is: "ADHOC",
    then: (s) =>
      s.required("Reason for adhoc advance is required"),
  }),

  requestedAmount: yup
    .number()
    .required("Amount is required")
    .positive(),

  expectedSettlementDate: yup
    .date()
    .nullable()
    .required("Settlement date is required"),
});
