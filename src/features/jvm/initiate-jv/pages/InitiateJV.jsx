import { Helmet } from "react-helmet-async";
import { Container, Card, CardContent } from "@mui/material";
import { JVModal, UploadJVModal } from "../components/InitiateJV";
import { InitiateJVColumns } from "../components/InitiateJV/InitiateJVColumns";
import ConfirmationModal from "src/components/ConfirmationModal";
import Header from "../components/InitiateJV/Header";
import EmptyState from "../components/InitiateJV/EmptyState";
import DataGridComponent from "../components/InitiateJV/DataGridComponent";
import Footer from "../components/InitiateJV/Footer";
import { useInitiateJV } from "../hooks/useInitiateJV";

export default function InitiateJV() {
  const {
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
  } = useInitiateJV();

  // Get columns from separate file
  const columns = InitiateJVColumns({ handleEdit, handleDelete });

  return (
    <>
      <Helmet>
        <title>Initiate Journal Voucher</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ mb: -15 }}>
        <Header
          showInfoText={showInfoText}
          onToggleInfoText={toggleInfoText}
          onAddManual={handleAdd}
          onUploadFile={openUploadModal}
        />

        <Card>
          <CardContent
            sx={{
              p: 0,
              "&:last-child": {
                pb: 0,
              },
            }}
          >
            {data.length === 0 && !loading ? (
              <EmptyState />
            ) : (
              <DataGridComponent
                data={data}
                columns={columns}
                loading={loading}
                onUpdateEntry={updateJVEntry}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Footer section - only show when there's data */}
        {data.length > 0 && (
          <Footer
            autoReversal={autoReversal}
            setAutoReversal={setAutoReversal}
            reversalRemarks={reversalRemarks}
            setReversalRemarks={setReversalRemarks}
            onSubmitRequest={handleSubmitRequest}
            submitting={submitting}
            supportingDocuments={supportingDocuments}
            setSupportingDocuments={setSupportingDocuments}
          />
        )}

        <JVModal
          open={modalOpen}
          onClose={closeModal}
          onSuccess={handleModalSuccess}
          editData={editData}
          mode={modalMode}
          existingData={data}
        />

        <UploadJVModal
          open={uploadModalOpen}
          onClose={closeUploadModal}
          onSuccess={handleUploadSuccess}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmSubmit}
          data={data}
          autoReversal={autoReversal}
          loading={submitting}
        />
      </Container>
    </>
  );
}
