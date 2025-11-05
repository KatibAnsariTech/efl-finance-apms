import { useState } from "react";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import {
  validateSlNoEntryLimit,
  validateSlNoBalance,
  validateSlNoDateConsistency,
  validateAllJVEntries,
  validatePostingKeyMatchesEntryType,
} from "../utils";
import { fExcelDate, parseExcelDate } from "src/utils/format-time";

export const useInitiateJV = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [autoReversal, setAutoReversal] = useState("");
  const [reversalRemarks, setReversalRemarks] = useState("");
  const [showInfoText, setShowInfoText] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const addJVEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slNo: newEntry.slNo || "",
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [...prev, entryWithId]);
  };

  const updateJVEntry = (updatedEntry) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === updatedEntry._id
          ? { ...item, ...updatedEntry }
          : item
      )
    );
  };

  const removeJVEntry = (entryId) => {
    setData((prev) => prev.filter((item) => item._id !== entryId));
  };

  const handleModalSuccess = (entry) => {
    if (modalMode === "add") {
      addJVEntry(entry);
      swal("Success!", "Journal voucher added successfully!", "success");
    } else {
      updateJVEntry(entry);
      setEditData(null);
      swal("Success!", "Journal voucher updated successfully!", "success");
    }
    setModalOpen(false);
  };

  const handleUploadSuccess = async (uploadedEntries, fileUrl) => {
    try {
      // Validate the new uploaded entries only (since we're resetting data)
      const validationResults = validateAllJVEntries(uploadedEntries);
      if (!validationResults.isValid) {
        const errorMessages = validationResults.errors.map((error) => {
          if (error.type === "entryLimit") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${group.slNo}: ${group.count} entries (Limit: ${group.limit})`
              )
              .join("\n");
          } else if (error.type === "balance") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${
                    group.slNo
                  }: Debit ₹${group.debit.toLocaleString()} vs Credit ₹${group.credit.toLocaleString()} (Difference: ₹${group.difference.toLocaleString()})`
              )
              .join("\n");
          } else if (error.type === "dateConsistency") {
            return error.details
              .map((group) => {
                let message = `Serial Number ${group.slNo}:`;
                if (group.inconsistentDocumentDate) {
                  message += `\n  - Document Date inconsistency`;
                }
                if (group.inconsistentPostingDate) {
                  message += `\n  - Posting Date inconsistency`;
                }
                return message;
              })
              .join("\n\n");
          }
        });

        await swal({
          title: "Validation Errors",
          text: errorMessages.join("\n\n"),
          icon: "error",
          button: "OK",
        });
        return;
      }

      // If all validations pass, reset existing data and add new entries
      setData([]); // Clear all existing data
      uploadedEntries.forEach((entry) => addJVEntry(entry));
      setUploadedFileUrl(fileUrl);
      setUploadModalOpen(false);
      swal("Success!", "Journal vouchers uploaded successfully!", "success");
    } catch (error) {
      console.error("Upload error:", error);
      showErrorMessage(error, "Failed to upload journal vouchers", swal);
    }
  };

  const handleConfirmSubmit = () => {
    // setConfirmModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);

      // Validate autoReversal is selected
      if (!autoReversal || autoReversal.trim() === "") {
        await swal({
          title: "Validation Error",
          text: "Please select Auto-reversal option before submitting.",
          icon: "error",
          button: "OK",
        });
        setSubmitting(false);
        return;
      }

      const validationResults = validateAllJVEntries(data);
      if (!validationResults.isValid) {
        const errorMessages = validationResults.errors.map((error) => {
          if (error.type === "entryLimit") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${group.slNo}: ${group.count} entries (Limit: ${group.limit})`
              )
              .join("\n");
          } else if (error.type === "balance") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${
                    group.slNo
                  }: Debit ₹${group.debit.toLocaleString()} vs Credit ₹${group.credit.toLocaleString()} (Difference: ₹${group.difference.toLocaleString()})`
              )
              .join("\n");
          } else if (error.type === "dateConsistency") {
            return error.details
              .map((group) => {
                let message = `Serial Number ${group.slNo}:`;
                if (group.inconsistentDocumentDate) {
                  message += `\n  - Document Date inconsistency`;
                }
                if (group.inconsistentPostingDate) {
                  message += `\n  - Posting Date inconsistency`;
                }
                return message;
              })
              .join("\n\n");
          }
        });

        await swal({
          title: "Validation Errors",
          text: errorMessages.join("\n\n"),
          icon: "error",
          button: "OK",
        });
        setSubmitting(false);
        return;
      }

      const [dtRes, atRes, pkRes, sgRes] = await Promise.all([
        userRequest.get("/jvm/getMasters?key=DocumentType&page=1&limit=1000"),
        userRequest.get("/jvm/getMasters?key=AccountType&page=1&limit=1000"),
        userRequest.get("/jvm/getMasters?key=PostingKey&page=1&limit=1000"),
        userRequest.get("/jvm/getMasters?key=SpecialGLIndication&page=1&limit=1000"),
      ]);

      const docTypes = dtRes?.data?.success 
        ? (dtRes.data.data?.masters || []).map((m) => (m.value || "").toString().trim().toUpperCase())
        : [];
      const accountTypes = atRes?.data?.success 
        ? (atRes.data.data?.masters || []).map((m) => (m.value || "").toString().trim())
        : [];
      const postingKeyMasters = pkRes?.data?.success ? pkRes.data.data?.masters || [] : [];
      const specialGLMasters = sgRes?.data?.success ? sgRes.data.data?.masters || [] : [];

      // Build validation sets
      const normalize = (v) => (v ?? "").toString().trim();
      const normalizeUpper = (v) => normalize(v).toUpperCase();

      const pkAllowedByAcct = postingKeyMasters.reduce((acc, m) => {
        const other0 = Array.isArray(m.other) ? m.other[0] : undefined;
        const acct = other0
          ? typeof other0 === "object"
            ? normalize(other0.value)
            : normalize(other0)
          : "";
        if (!acct) return acc;
        acc[acct] = acc[acct] || new Set();
        acc[acct].add(normalize(m.value));
        return acc;
      }, {});
      
      const sgAllowedByAcct = specialGLMasters.reduce((acc, m) => {
        const other0 = Array.isArray(m.other) ? m.other[0] : undefined;
        const acct = other0
          ? typeof other0 === "object"
            ? normalize(other0.value)
            : normalize(other0)
          : "";
        if (!acct) return acc;
        acc[acct] = acc[acct] || new Set();
        acc[acct].add(normalize(m.value));
        return acc;
      }, {});

      const pkAll = new Set(postingKeyMasters.map((m) => normalize(m.value)));
      const sgAll = new Set(specialGLMasters.map((m) => normalize(m.value)));
      const dtAll = new Set(docTypes);
      const atAll = new Set(accountTypes);

      // Validate each entry against master data and required fields
      const masterDataErrors = [];
      data.forEach((entry, idx) => {
        const line = idx + 1;
        const dt = normalizeUpper(entry.documentType);
        const at = normalize(entry.accountType);
        const pk = normalize(entry.postingKey);
        const sg = normalize(entry.specialGLIndication);

        // Required field validations
        if (!entry.slNo || entry.slNo.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Serial Number is required`);
        }
        if (!dt || !dtAll.has(dt)) {
          masterDataErrors.push(
            `Entry ${line}: Invalid or missing Document Type '${entry.documentType || 'empty'}'`
          );
        }
        if (!entry.documentDate) {
          masterDataErrors.push(`Entry ${line}: Document Date is required`);
        }
        if (!at || !atAll.has(at)) {
          masterDataErrors.push(`Entry ${line}: Invalid or missing Account Type '${entry.accountType || 'empty'}'`);
        }
        if (!pk || !pkAll.has(pk)) {
          masterDataErrors.push(`Entry ${line}: Invalid or missing Posting Key '${entry.postingKey || 'empty'}'`);
        }
        if (!entry.type) {
          masterDataErrors.push(`Entry ${line}: Type is required`);
        }
        if (!entry.vendorCustomerGLNumber || entry.vendorCustomerGLNumber.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Vendor/Customer/GL Number is required`);
        }
        if (!entry.amount || parseFloat(entry.amount) <= 0) {
          masterDataErrors.push(`Entry ${line}: Amount is required and must be greater than 0`);
        }
        if (!entry.assignment || entry.assignment.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Assignment is required`);
        }
        if (!entry.profitCenter || entry.profitCenter.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Profit Center is required`);
        }
        if (!entry.referenceNumber || entry.referenceNumber.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Reference Number is required`);
        }
        if (!entry.remarks || entry.remarks.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Remarks is required`);
        }
        if (!entry.postingDate) {
          masterDataErrors.push(`Entry ${line}: Posting Date is required`);
        }
        if (!entry.costCenter || entry.costCenter.toString().trim() === "") {
          masterDataErrors.push(`Entry ${line}: Cost Center is required`);
        }

        // Optional field validations (only validate format if provided)
        // personalNumber is optional - validate format if provided
        if (entry.personalNumber && entry.personalNumber.toString().trim() !== "") {
          const personalNum = entry.personalNumber.toString().trim();
          if (!/^\d{7}$/.test(personalNum)) {
            masterDataErrors.push(`Entry ${line}: Personal Number must be exactly 7 digits when provided`);
          }
        }
        // vendorCustomerGLName is optional - no validation needed
        // specialGLIndication is optional - validate format and master data if provided
        if (sg && !sgAll.has(sg)) {
          masterDataErrors.push(
            `Entry ${line}: Invalid Special GL Indication '${entry.specialGLIndication}'`
          );
        }

        // Relationship checks only if Account Type is valid
        if (atAll.has(at)) {
          const allowedPK = pkAllowedByAcct[at];
          if (allowedPK && !allowedPK.has(pk)) {
            masterDataErrors.push(
              `Entry ${line}: Posting Key '${entry.postingKey}' not allowed for Account Type '${entry.accountType}'`
            );
          }
          const allowedSG = sgAllowedByAcct[at];
          if (allowedSG && sg && !allowedSG.has(sg)) {
            masterDataErrors.push(
              `Entry ${line}: Special GL '${entry.specialGLIndication}' not allowed for Account Type '${entry.accountType}'`
            );
          }
        }

        // Validate posting key transaction type matches entry type
        if (pk && entry.type) {
          const validation = validatePostingKeyMatchesEntryType(
            pk,
            entry.type,
            postingKeyMasters
          );
          
          if (!validation.isValid) {
            masterDataErrors.push(`Entry ${line}: ${validation.error}`);
          }
        }
      });

      if (masterDataErrors.length > 0) {
        const maxShow = 15;
        const msg =
          masterDataErrors.slice(0, maxShow).join("\n") +
          (masterDataErrors.length > maxShow
            ? `\n...and ${masterDataErrors.length - maxShow} more.`
            : "");
        await swal({
          title: "Master Data Validation Errors",
          text: msg,
          icon: "error",
          button: "OK",
        });
        setSubmitting(false);
        return;
      }

      const items = data.map((entry) => ({
        slNo: parseInt(entry.slNo) || 0,
        documentType: entry.documentType,
        // documentDate: new Date(entry.documentDate).toISOString(),
        documentDate: parseExcelDate(entry.documentDate),
        businessArea: entry.businessArea,
        accountType: entry.accountType,
        postingKey: String(entry.postingKey),
        vendorCustomerGLNumber: entry.vendorCustomerGLNumber,
        amount: parseFloat(entry.amount),
        type: entry.type,
        assignment: entry.assignment,
        profitCenter: entry.profitCenter,
        specialGLIndication: entry.specialGLIndication,
        referenceNumber: entry.referenceNumber,
        remarks: entry.remarks,
        // postingDate: new Date(entry.postingDate).toISOString(),
        postingDate: parseExcelDate(entry.postingDate),
        vendorCustomerGLName: entry.vendorCustomerGLName,
        costCenter: entry.costCenter,
        personalNumber: entry.personalNumber,
      }));

      const requestData = {
        autoReversal: autoReversal === "Yes",
        reversalRemarks: autoReversal === "Yes" ? reversalRemarks : "",
        document: uploadedFileUrl,
        supportingDocuments: supportingDocuments,
        items: items,
      };

      const response = await userRequest.post("jvm/createRequest", requestData);

      swal(
        "Success!",
        "Journal voucher request submitted successfully!",
        "success"
      );

      // Reset form
      setData([]);
      setUploadedFileUrl("");
      setAutoReversal("");
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage(error, "Failed to submit journal voucher request", swal);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    const result = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this journal voucher!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (result) {
      try {
        removeJVEntry(row._id);
        swal("Deleted!", "Journal voucher has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(error, "Failed to delete journal voucher", swal);
      }
    }
  };

  const toggleInfoText = () => {
    setShowInfoText(!showInfoText);
  };

  const openUploadModal = () => {
    setUploadModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
  };


  return {
    // State
    data,
    loading,
    modalOpen,
    modalMode,
    editData,
    uploadModalOpen,
    autoReversal,
    reversalRemarks,
    showInfoText,
    confirmModalOpen,
    submitting,
    page,
    rowsPerPage,
    supportingDocuments,
    
    // Setters
    setAutoReversal,
    setReversalRemarks,
    setPage,
    setRowsPerPage,
    setSupportingDocuments,
    
    // Handlers
    handleModalSuccess,
    handleUploadSuccess,
    handleConfirmSubmit,
    handleSubmitRequest,
    handleEdit,
    handleAdd,
    handleDelete,
    toggleInfoText,
    openUploadModal,
    closeModal,
    closeUploadModal,
    closeConfirmModal,
    
    // Helpers
    updateJVEntry,
  };
};
