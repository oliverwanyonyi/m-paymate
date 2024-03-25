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
  Switch,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { AuthContext } from "../store/AuthProvider";
import { AppContext } from "../store/AppProvider";
import { axiosInstance } from "../axios/axios";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { enqueueSnackbar } from "notistack";
const UserList = () => {
  const { handleNavigate } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState();
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState();

  function onNavigate(path) {
    handleNavigate(path);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  async function handleDelete(itemId) {
    try {
     const {data} = await axiosInstance.delete(`/users/${itemId}/delete`);
      setData((prev) => {
        return prev.filter((item) => item.id !== itemId);
      });

      enqueueSnackbar(data, {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || "Network Error", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "bottom" },
          });
    }
  }

  const handleVerify = async (userId, value) => {
    try {
      await axiosInstance.put(`/users/${userId}/update`, { active: value });
      enqueueSnackbar("User Updated", {
        variant: "success",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });

      setData((prev) => {
        return prev.map((user) =>
          user.id === userId ? { ...user, active: value } : user
        );
      });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Network Error", {
        variant: "error",
        anchorOrigin: { horizontal: "center", vertical: "bottom" },
      });
    }
  };

  async function getData() {
    const { data } = await axiosInstance.get(`/users?page=${currentPage}`);

    setPageCount(data.pageCount);
    setData(data.users);
  }

  useEffect(() => {
    getData();
  }, [currentPage]);

  return (
    <div className="route">
      <h3 className="page-title">Users</h3>
      <div className="content">
        <TableContainer className="table-container" component={Paper}>
        
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone</TableCell>

                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, idx) => (
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
                  <TableCell component="th" scope="row">
                    {row.email}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <div className="btn-row">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>

                      <div>
                        <Switch
                          checked={row?.active}
                          onChange={(e)=>handleVerify(row.id, e.target.checked)}
                          name="verified"
                          color="primary"
                        />
                       {row?.active ?"Enabled": "Disabled"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!data?.length && <div className="message-box">No Items Found</div>}

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

export default UserList;
