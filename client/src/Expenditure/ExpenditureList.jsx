import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Pagination,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "../store/AuthProvider";
import { AppContext } from "../store/AppProvider";
import { axiosInstance } from "../axios/axios";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
const ExpenditureList = () => {
  const { handleNavigate } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [expenditures, setExpenditures] = useState();
  const [pageCount, setPageCount] = useState(0);
  const data = [
    { id: 1, name: "Electricity", amount: 100 },
    { id: 2, name: "Rent", amount: 800 },
    { id: 3, name: "Water", amount: 50 },
    { id: 4, name: "Netflix", amount: 15 },
  ];

  function onNavigate(path) {
    handleNavigate(path);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  async function handleDelete(itemId) {
    try {
      await axiosInstance.delete(`/expenditure/${itemId}/delete`);
      setExpenditures((prev) => {
        return prev.filter((item) => item.id !== itemId);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function getExpenditures() {
    const { data } = await axiosInstance.get(
      `/expenditure/all?page=${currentPage}`
    );
    console.log(data);
    setPageCount(data.pageCount);
    setExpenditures(data.expenditures);
  }

  useEffect(() => {
    getExpenditures();
  }, [currentPage]);

  return (
    <div className="route">
      <h3 className="page-title">Expenditures</h3>
      <div className="content">
        <TableContainer className="table-container" component={Paper}>
          <Box display="flex" className="page-header">
            <Button
              variant="contained"
              color="primary"
              startIcon={<MdAdd />} // Add the Add icon as start icon
              sx={{ marginBottom: 2 }} // Add some margin at the bottom for spacing
              onClick={() => onNavigate("/expenditure/add")}
            >
              Add Expenditure
            </Button>
          </Box>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenditures?.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={idx % 2 !== 0 ? "striped" : ""}
                >
                  <TableCell component="th" scope="row">
                    {idx + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell>
                    <div className="btn-row">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>

                     
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleNavigate(`/expenditure/${row?.id}/edit`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!expenditures?.length && (
            <div className="message-box">No Items Found</div>
          )}

          <div className="pagination-section">
            <Stack spacing={2}>
              <Pagination
                count={pageCount}
                variant="outlined"
                shape="rounded"
                color="primary"
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </TableContainer>
      </div>
    </div>
  );
};

export default ExpenditureList;
