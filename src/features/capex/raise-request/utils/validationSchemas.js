import * as yup from "yup";

// CAPEX Item validation schema
export const capexItemSchema = yup.object().shape({
  description: yup.string().required("Capex Description / Equipment is required"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be greater than 0")
    .integer("Quantity must be a whole number"),
  uom: yup.string().required("UOM is required"),
  specification: yup.string(),
  costPerUnit: yup
    .number()
    .required("Cost Per Unit is required")
    .positive("Cost Per Unit must be greater than 0"),
  totalCost: yup.number().min(0, "Total Cost must be greater than or equal to 0"),
});

// CAPEX Form validation schema
export const capexFormSchema = yup.object().shape({
  businessVertical: yup.string().required("Business Vertical is required"),
  location: yup.string().required("Location is required"),
  function: yup.string().required("Function is required"),
  businessPlantCode: yup.string().required("Plant Code is required"),
  capexItems: yup
    .array()
    .of(capexItemSchema)
    .min(1, "At least one CAPEX item is required")
    .required("CAPEX items are required"),
  applicationDetails: yup.string().required("Application Details is required"),
  acceptanceCriteria: yup.string().required("Acceptance Criteria is required"),
  currentScenario: yup.string().required("Current Scenario is required"),
  proposedAfterScenario: yup.string().required("Proposed After Scenario is required"),
  expectedImplementationDate: yup
    .date()
    .nullable()
    .required("Expected Implementation Date is required"),
  capacityAlignment: yup.string().required("Capacity Alignment is required"),
  alternateMakeTechnology: yup.string().required("Technology Evaluation is required"),
  modificationOrUpgrade: yup
    .string()
    .required("Modification or Upgrade is required")
    .oneOf(["Yes", "No"], "Please select Yes or No"),
  challengesInPresentSystem: yup.string().when("modificationOrUpgrade", {
    is: "Yes",
    then: (schema) => schema.required("Challenges in Present System is required when Modification/Upgrade is Yes"),
    otherwise: (schema) => schema.nullable(),
  }),
  previousModificationHistory: yup.string().when("modificationOrUpgrade", {
    is: "Yes",
    then: (schema) => schema.required("Previous Modification History is required when Modification/Upgrade is Yes"),
    otherwise: (schema) => schema.nullable(),
  }),
  vendorOEM: yup.string().when("modificationOrUpgrade", {
    is: "Yes",
    then: (schema) => schema.required("Vendor - OEM is required when Modification/Upgrade is Yes"),
    otherwise: (schema) => schema.nullable(),
  }),
  oldPOReference: yup.string().when("modificationOrUpgrade", {
    is: "Yes",
    then: (schema) => schema.required("OLD PO Reference is required when Modification/Upgrade is Yes"),
    otherwise: (schema) => schema.nullable(),
  }),
  oldAssetCode: yup.string().when("modificationOrUpgrade", {
    is: "Yes",
    then: (schema) => schema.required("OLD Asset Code is required when Modification/Upgrade is Yes"),
    otherwise: (schema) => schema.nullable(),
  }),
  reasonForNeed: yup.string().required("Reason for Need is required"),
  benefitsOnInvestment: yup.string().required("Benefits on Investment is required"),
  budgetBasicCost: yup
    .number()
    .required("Budget Basic Cost is required")
    .positive("Budget Basic Cost must be greater than 0"),
  impactOnBusiness: yup.string().required("Impact on Business is required"),
  newAssetCode: yup.string().required("New Asset Code is required"),
  businessCaseROI: yup.string().required("Business Case ROI is required"),
  documents: yup.object().shape({
    rfq: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .test('is-array', 'RFQ must be an array', (value) => Array.isArray(value))
      .test('min-length', 'RFQ- Details Requirement Draft is required', (value) => 
        Array.isArray(value) && value.length > 0
      ),
    offer1: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .test('is-array', 'Offer 1 must be an array', (value) => Array.isArray(value))
      .test('min-length', 'Offer 1 is required', (value) => 
        Array.isArray(value) && value.length > 0
      ),
    drawings: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
    layout: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
    catalogue: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
    offer2: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
    offer3: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
    previousHistory: yup
      .mixed()
      .transform((value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'string') return [value];
        return [];
      })
      .nullable(),
  }).required("Documents are required"),
  projectStatus: yup
    .string()
    .required("Project Status is required")
    .notOneOf([""], "Project Status is required"),
  submitCheckBox: yup
    .boolean()
    .oneOf([true], "You must confirm the submission"),
});

// CAPEX Form validation schema (for draft - more lenient)
export const capexFormDraftSchema = yup.object().shape({
  businessVertical: yup.string(),
  location: yup.string(),
  function: yup.string(),
  businessPlantCode: yup.string(),
  capexItems: yup.array().of(capexItemSchema),
  applicationDetails: yup.string(),
  acceptanceCriteria: yup.string(),
  currentScenario: yup.string(),
  proposedAfterScenario: yup.string(),
  expectedImplementationDate: yup.date().nullable(),
  capacityAlignment: yup.string(),
  alternateMakeTechnology: yup.string(),
  modificationOrUpgrade: yup.string(),
  challengesInPresentSystem: yup.string(),
  previousModificationHistory: yup.string(),
  vendorOEM: yup.string(),
  oldPOReference: yup.string(),
  oldAssetCode: yup.string(),
  reasonForNeed: yup.string(),
  benefitsOnInvestment: yup.string(),
  budgetBasicCost: yup.number().min(0),
  impactOnBusiness: yup.string(),
  newAssetCode: yup.string(),
  businessCaseROI: yup.string(),
});

