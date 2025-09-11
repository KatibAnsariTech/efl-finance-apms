import { BACKEND_URL } from 'src/config/config';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Scrollbar from 'src/components/scrollbar';
import CircularIndeterminate from 'src/utils/loader';
import FormTableToolbar from '../form-table-toolbar';
import FormTableHead from '../form-table-head';
import FormTableRow from '../form-table-row';
import { applyFilter, getComparator } from 'src/utils/utils';
import excel from '../../../../public/assets/excel.svg';
import TableNoData from '../table-no-data';
import { userRequest } from 'src/requestMethod';
import ApproversModal from '../parallel-approvers-modal';
import ColorIndicators from '../colorIndicator';

export default function HierarchyView() {
  const [data, setData] = useState([]);
  const [hierarchyData, setHierarchyData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [approversEmails, setApproversEmails] = useState([]);


  const handleOpenModal = (emails) => {
    setApproversEmails(emails);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setApproversEmails([]);
  };

  const getData = async () => {
    try {
      setLoading(true)
      const res = await userRequest.get('/admin/getHierarchies', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          sort: orderBy,
          order: order,
        },
      });

      setLoading(false);
      setData(res?.data?.data);
      setHierarchyData(res?.data?.data?.hierarchies);
      setTotalCount(res?.data?.data?.totalHierarchies || 0);
    } catch (err) {
      console.log('err:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    getData();
  }, [debouncedSearch, page, rowsPerPage]);

  const sortableColumns = ['createdAt', 'customerName'];

  const handleSort = (event, id) => {
    if (sortableColumns.includes(id)) {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);
    setLimit(rowsPerPage);
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const dataFiltered = applyFilter({
    inputData: hierarchyData,
    comparator: getComparator(order, orderBy),
    search,
  });

  let notFound = !dataFiltered.length && !!search;

  // console.log(notFound);
  const headLabel = [
    { id: 'createdAt', label: 'Response Date', sortable: true, minWidth: 160 },
    { id: 'slNo', label: 'Request No.', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 110 },
    { id: 'requesterEmail', label: 'Requester Email Id', minWidth: 170 },
    { id: 'totalRecipients', label: 'Total Recipients', minWidth: 150 },

    // Recipient 1
    { id: 'recipientOne', label: 'Recipient 1', minWidth: 160 },
    { id: 'recipientOneStatus', label: 'Recipient 1 Status', minWidth: 160 },
    { id: 'recipientOneIssueDate', label: 'Recipient 1 Issue Date', minWidth: 140 },
    { id: 'recipientOneResponseDate', label: 'Recipient 1 Response Date', minWidth: 140 },
    { id: 'recipientOneComment', label: 'Recipient 1 Comment', minWidth: 130 },

    // Recipient 2
    { id: 'recipientTwo', label: 'Recipient 2', minWidth: 160 },
    { id: 'recipientTwoStatus', label: 'Recipient 2 Status', minWidth: 160 },
    { id: 'recipientTwoIssueDate', label: 'Recipient 2 Issue Date', minWidth: 120 },
    { id: 'recipientTwoResponseDate', label: 'Recipient 2 Response Date', minWidth: 130 },
    { id: 'recipientTwoComment', label: 'Recipient 2 Comment', minWidth: 180 },

    // Recipient 3
    { id: 'recipientThree', label: 'Recipient 3', minWidth: 160 },
    { id: 'recipientThreeStatus', label: 'Recipient 3 Status', minWidth: 160 },
    { id: 'recipientThreeIssueDate', label: 'Recipient 3 Issue Date', minWidth: 190 },
    { id: 'recipientThreeResponseDate', label: 'Recipient 3 Response Date', minWidth: 200 },
    { id: 'recipientThreeComment', label: 'Recipient 3 Comment', minWidth: 180 },

    // Recipient 4
    { id: 'recipientFour', label: 'Recipient 4', minWidth: 160 },
    { id: 'recipientFourStatus', label: 'Recipient 4 Status', minWidth: 160 },
    { id: 'recipientFourIssueDate', label: 'Recipient 4 Issue Date', minWidth: 190 },
    { id: 'recipientFourResponseDate', label: 'Recipient 4 Response Date', minWidth: 220 },
    { id: 'recipientFourComment', label: 'Recipient 4 Comment', minWidth: 180 },

    // Recipient 5
    { id: 'recipientFive', label: 'Recipient 5', minWidth: 160 },
    { id: 'recipientFiveStatus', label: 'Recipient 5 Status', minWidth: 160 },
    { id: 'recipientFiveIssueDate', label: 'Recipient 5 Issue Date', minWidth: 190 },
    { id: 'recipientFiveResponseDate', label: 'Recipient 5 Response Date', minWidth: 220 },
    { id: 'recipientFiveComment', label: 'Recipient 5 Comment', minWidth: 180 },

    // Recipient 6
    { id: 'recipientSix', label: 'Recipient 6', minWidth: 160 },
    { id: 'recipientSixStatus', label: 'Recipient 6 Status', minWidth: 160 },
    { id: 'recipientSixIssueDate', label: 'Recipient 6 Issue Date', minWidth: 190 },
    { id: 'recipientSixResponseDate', label: 'Recipient 6 Response Date', minWidth: 220 },
    { id: 'recipientSixComment', label: 'Recipient 6 Comment', minWidth: 180 },
  ];

  const handleExport = async () => {
    try {
      const exportResponse = await userRequest.get(
        `/admin/exportHierarchiesToExcel?search=${search}`,
        {
          responseType: 'blob',
        }
      );

      // Create a Blob object from the response data
      const blob = new Blob([exportResponse.data], {
        type: 'application/octet-stream',
      });

      // Create a URL for the blob and initiate download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'Hierarchy.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error exporting data. Please try again later.');
    }
  };

  return (
    <Container>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '20px' }}>
          <FormTableToolbar search={search} onFilterChange={handleFilterChange} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#167beb',
              cursor: 'pointer',
            }}
            onClick={handleExport}
          >
            Export <img src={excel} style={{ width: '1.2rem', marginLeft: '5px' }} />
          </div>
        </div>

        <Scrollbar>
          {loading && <CircularIndeterminate />}
          {!loading && (
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <FormTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={data?.length}
                  onRequestSort={handleSort}
                  headLabel={headLabel}
                />
                <TableBody>
                  {dataFiltered &&
                    dataFiltered.map((row) => (
                      <FormTableRow
                        key={row._id}
                        createdAt={row?.createdAt}
                        slNo={row?.slNo}
                        status={row?.status}
                        requesterEmail={row?.step1.length > 1 ? <span  onClick={() => handleOpenModal(row.step1.map((item) => item.email))}>Parallel Approvers</span> : row?.step1[0]?.email}
                        totalRecipients={row?.totalRecipients}
                        recipientOne={row?.step1.length > 1 ? <span  onClick={() => handleOpenModal(row.step1.map((item) => item.email))}>Parallel Approvers</span> : row?.step1[0]?.email}
                        recipientOneStatus={row?.step1[0]?.status}
                        recipientOneIssueDate={row?.step1[0]?.createdAt}
                        recipientOneResponseDate={row?.step1[0]?.updatedAt}
                        recipientOneComment={row?.step1[0]?.comment}
                        recipientTwo={row?.step2.length > 1 ? <span  onClick={() => handleOpenModal(row.step2.map((item) => item.email))}>Parallel Approvers</span> : row?.step2[0]?.email}
                        recipientTwoStatus={row?.step2[0]?.status}
                        recipientTwoIssueDate={row?.step2[0]?.createdAt}
                        recipientTwoResponseDate={row?.step2[0]?.updatedAt}
                        recipientTwoComment={row?.step2[0]?.comment}
                        recipientThree={row?.step3.length > 1 ? <span  onClick={() => handleOpenModal(row.step3.map((item) => item.email))}>Parallel Approvers</span> : row?.step3[0]?.email}
                        recipientThreeStatus={row?.step3[0]?.status}
                        recipientThreeIssueDate={row?.step3[0]?.createdAt}
                        recipientThreeResponseDate={row?.step3[0]?.updatedAt}
                        recipientThreeComment={row?.step3[0]?.comment}
                        recipientFour={row?.step4.length > 1 ? <span  onClick={() => handleOpenModal(row.step4.map((item) => item.email))}>Parallel Approvers</span> : row?.step4[0]?.email}
                        recipientFourStatus={row?.step4[0]?.status}
                        recipientFourIssueDate={row?.step4[0]?.createdAt}
                        recipientFourResponseDate={row?.step4[0]?.updatedAt}
                        recipientFourComment={row?.step4[0]?.comment}
                        recipientFive={row?.step5[0]?.email}
                        recipientFiveStatus={row?.step5.length > 1 ? <span  onClick={() => handleOpenModal(row.step5.map((item) => item.email))}>Parallel Approvers</span> : row?.step5[0]?.status}
                        recipientFiveIssueDate={row?.step5[0]?.createdAt}
                        recipientFiveResponseDate={row?.step5[0]?.updatedAt}
                        recipientFiveComment={row?.step5[0]?.comment}
                        recipientSix={row?.step6.length > 1 ? <span  onClick={() => handleOpenModal(row.step6.map((item) => item.email))}>Parallel Approvers</span> : row?.step6[0]?.email}
                        recipientSixStatus={row?.step6[0]?.status}
                        recipientSixIssueDate={row?.step6[0]?.createdAt}
                        recipientSixResponseDate={row?.step6[0]?.updatedAt}
                        recipientSixComment={row?.step6[0]?.comment}

                        // onClick={() => {
                        //   setSelectedRowData(row);
                        //   setOpenModal(true);
                        // }}
                      />
                    ))}

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
            
          )}
        </Scrollbar>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <ColorIndicators />
          <TablePagination
            page={page}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Card>
       <ApproversModal open={modalOpen} handleClose={handleCloseModal} emails={approversEmails} />
    </Container>
  );
}
