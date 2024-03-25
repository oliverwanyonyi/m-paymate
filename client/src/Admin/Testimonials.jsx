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
  import Rating from '@mui/material/Rating';
  import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
  import EditIcon from "@mui/icons-material/Edit";
  import { enqueueSnackbar } from "notistack";
  const Testimonials = () => {
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
       const {data} = await axiosInstance.delete(`/testimonials/${itemId}/delete`);
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
  
    const handleVerify = async (itemId, value) => {
      try {
      const {data} = await axiosInstance.put(`/testimonials/${itemId}/update`, { verified: value });
        enqueueSnackbar(data, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
  
        setData((prev) => {
          return prev.map((item) =>
            item.id === itemId ? { ...item, verified: value } : item
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
      const { data } = await axiosInstance.get(`/testimonials?page=${currentPage}`);
  
      setPageCount(data.pageCount);
      setData(data.testimonials);
    }
  
    useEffect(() => {
      getData();
    }, [currentPage]);
  
    return (
      <div className="route">
        <h3 className="page-title">Testimonials</h3>
        <div className="content">
          <TableContainer className="table-container" component={Paper}>
          
            <Table>
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Reviewer</TableCell>
                  <TableCell >Rating</TableCell>
                  <TableCell >Description</TableCell>
  
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
                    <Rating value={row.rating} readOnly precision={0.5} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.description}
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
                            checked={row?.verified}
                            onChange={(e)=>handleVerify(row.id, e.target.checked)}
                            name="verified"
                            color="primary"
                          />
                         {row?.verified ?"Verfied": "Unverified"}
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
  )
}

export default Testimonials