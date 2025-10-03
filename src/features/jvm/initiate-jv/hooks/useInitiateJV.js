import { useState } from "react";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import {
  validateSlNoEntryLimit,
  validateSlNoBalance,
  validateSlNoDateConsistency,
} from "../utils";

export const useInitiateJV = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [autoReversal, setAutoReversal] = useState("No");
  const [reversalRemarks, setReversalRemarks] = useState("");
  const [showInfoText, setShowInfoText] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  
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
          ? { ...updatedEntry, slNo: item.slNo }
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
      // Validate slNo entry limit before uploading
      const exceededGroups = validateSlNoEntryLimit(uploadedEntries);
      if (exceededGroups.length > 0) {
        const errorMessage = exceededGroups
          .map(
            (group) =>
              `Serial Number ${group.slNo}: ${group.count} entries (Limit: ${group.limit})`
          )
          .join("\n");

        await swal({
          title: "Validation Error",
          text: `The following serial numbers exceed the maximum entry limit:\n\n${errorMessage}\n\nPlease ensure that each serial number has no more than 950 entries.`,
          icon: "error",
          button: "OK",
        });
        return;
      }

      // Validate slNo balance before uploading
      const unbalancedGroups = validateSlNoBalance(uploadedEntries);
      if (unbalancedGroups.length > 0) {
        const errorMessage = unbalancedGroups
          .map(
            (group) =>
              `Serial Number ${
                group.slNo
              }: Debit ₹${group.debit.toLocaleString()} vs Credit ₹${group.credit.toLocaleString()} (Difference: ₹${group.difference.toLocaleString()})`
          )
          .join("\n");

        await swal({
          title: "Validation Error",
          text: `The following serial numbers have unbalanced debit and credit amounts:\n\n${errorMessage}\n\nPlease ensure that for each serial number, the total debit amount equals the total credit amount.`,
          icon: "error",
          button: "OK",
        });
        return;
      }

      // Validate slNo date consistency before uploading
      const inconsistentDateGroups = validateSlNoDateConsistency(uploadedEntries);
      if (inconsistentDateGroups.length > 0) {
        const errorMessage = inconsistentDateGroups
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

        await swal({
          title: "Validation Error",
          text: `The following serial numbers have inconsistent dates:\n\n${errorMessage}\n\nPlease ensure that all records with the same serial number have identical Document Date and Posting Date.`,
          icon: "error",
          button: "OK",
        });
        return;
      }

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
    console.log("Submit confirmed");
  };

  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);

      const items = data.map((entry) => ({
        slNo: parseInt(entry.slNo) || 0,
        documentType: entry.documentType,
        documentDate: new Date(entry.documentDate).toISOString(),
        businessArea: entry.businessArea,
        accountType: entry.accountType,
        postingKey: entry.postingKey,
        vendorCustomerGLNumber: entry.vendorCustomerGLNumber,
        amount: parseFloat(entry.amount),
        type: entry.type,
        assignment: entry.assignment,
        profitCenter: entry.profitCenter,
        specialGLIndication: entry.specialGLIndication,
        referenceNumber: entry.referenceNumber,
        remarks: entry.remarks,
        postingDate: new Date(entry.postingDate).toISOString(),
        vendorCustomerGLName: entry.vendorCustomerGLName,
        costCenter: entry.costCenter,
        personalNumber: entry.personalNumber,
      }));

      const requestData = {
        autoReversal: autoReversal === "Yes",
        reversalRemarks: autoReversal === "Yes" ? reversalRemarks : "",
        document: uploadedFileUrl,
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
      setAutoReversal("No");
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
    
    // Setters
    setAutoReversal,
    setReversalRemarks,
    setPage,
    setRowsPerPage,
    
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
