import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/AppProvider";
import {
  Box,
  Button,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
} from "@mui/material";

import { MdAdd } from "react-icons/md";
import { axiosInstance } from "../axios/axios";
import PaymentIcon from "@mui/icons-material/Payments";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { format } from "date-fns";
import ModalComponent from "../components/Modal";
const Bill = () => {
  const { handleNavigate } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedBill, setSelectedBill] = useState();
  const [paymentType, setPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [tillNumber, setTillNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bussinessNumber, setBusinessNumber] = useState("");
  const [phone, setPhone] = useState("");
  const { handleOpen, handlClose } = useContext(AppContext);
  function onNavigate(path) {
    handleNavigate(path);
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  function handleClick(bill) {
    setSelectedBill(bill);

    handleOpen();
  }

  async function handleDelete(itemeId) {
    try {
      await axiosInstance.delete(`/bills/${itemeId}/delete`);
      setData((prev) => {
        return prev.filter((item) => item.id !== itemeId);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getData() {
    const { data } = await axiosInstance.get(`/bills/all?page=${currentPage}`);

    setPageCount(data.pageCount);
    setData(data.bills);
  }

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePaymentTypeChange = (e) => {
    if (e.target.value === "record") {
      setPaymentMethod("");
    }

    setPaymentType(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      paymentType,
      paymentMethod,
    };

    axios
      .post("/process-payment", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="route">
      <ModalComponent title={`Pay ${selectedBill?.expense} Bill`}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                {/* <InputLabel id="payment-type-label">Payment Type</InputLabel> */}
                <TextField
                  select
                  labelId="payment-type-label"
                  label="Select Payment Type"
                  value={paymentType}
                  onChange={handlePaymentTypeChange}
                >
                  <MenuItem value="electronic">
                    Pay Bill Electronically
                  </MenuItem>
                  <MenuItem value="record">Record Transaction Details</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            {paymentType === "record" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                  />
                </Grid>
              </>
            )}
            {paymentType === "electronic" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  {/* <InputLabel id="payment-method-label">Payment Method</InputLabel> */}
                  <TextField
                    select
                    labelId="payment-method-label"
                    label="Select Payment Method"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <MenuItem value="paybill">Use Paybill</MenuItem>
                    <MenuItem value="till">Use Till Number</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            )}
            {paymentMethod === "paybill" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Business Number"
                    variant="outlined"
                    fullWidth
                    value={bussinessNumber}
                    onChange={(e) => setBusinessNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Account Number"
                    variant="outlined"
                    fullWidth
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
              </>
            )}

            {paymentMethod === "till" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Till Number"
                    value={tillNumber}
                    onChange={(e) => setTillNumber(e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {paymentType === "electronic" ? "Initate Payment" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </ModalComponent>
      <h3 className="page-title">Bills</h3>
      <div className="content">
        <TableContainer className="table-container" component={Paper}>
          <Box display="flex" className="page-header">
            <Button
              variant="contained"
              color="primary"
              startIcon={<MdAdd />} // Add the Add icon as start icon
              sx={{ marginBottom: 2 }} // Add some margin at the bottom for spacing
              onClick={() => onNavigate("/bills/add")}
            >
              Add Bill
            </Button>
          </Box>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Action</TableCell>
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
                    {row.expense}
                  </TableCell>
                  <TableCell align="right">Ksh{row.amount}</TableCell>

                  <TableCell align="right">
                    {format(row.due_date, "yyyy/MM/dd", {
                      timeZone: "Africa/Nairobi",
                    })}
                  </TableCell>

                  <TableCell align="right">{row.status}</TableCell>

                  <TableCell align="right">
                    Ksh {row.amount - (row.balance || 0)}
                  </TableCell>

                  <TableCell>
                    <div className="btn-row">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PaymentIcon />}
                        onClick={() => handleClick(row)}
                      >
                        Pay
                      </Button>
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

export default Bill;
