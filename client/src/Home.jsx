import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Button } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { axiosInstance } from "./axios/axios";
import Chart from "./components/Chart";
import { format, getMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';

const currentDate = new Date();
const currentMonth = format(currentDate, 'MMMM', { locale: enUS });

const Home = () => {
  const [data, setData] = useState({
    totalBudget: 0,
    remainingBudget: 0,
    outgoingMoney: 0,
    pendingBillsCount: 0,
    billsCount: 0,
    totalSpent: 0,
    categoryLabels: [],
    budgetAmounts: [],
    totalAmountsSpent: [],
    transactionAmounts: [],
  });

  async function getDashboardData() {
    const { data } = await axiosInstance.get(`/budget/account/summary`);
    setData({
      ...data,
      totalBudget: data?.totalBudget,
      remainingBudget: data?.remainingBudget,
      outgoingMoney: data?.outgoingMoney,
      pendingBillsCount: data?.pendingBillsCount,
      billsCount: data?.total_bills_count,
      totalSpent: data?.totalSpent,
    });
    

    const categoryLabels = data?.budget_categories.map(
      (category) => category.name
    );
    const budgetAmounts = data?.budget_categories.map(
      (category) => category.amount
    );
    const totalAmountsSpent = data?.budget_categories.map(
      (category) => category.total_amount_spent
    );

    const transactionAmounts = data?.budget_categories.map((category) => {
      return category.transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
    });

    setData({
      ...data,
      categoryLabels,
      budgetAmounts,
      totalAmountsSpent,
      transactionAmounts,
    });
  }

  useEffect(() => {
    getDashboardData();
  }, []);
  return (
    <div>
      <h4 variant="h4" className="dash-summary" gutterBottom>
     Account Summary 

     <span className="success">
       {currentMonth}
      </span>
      </h4>
      <Grid container spacing={3} className="analytics-container">
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            <AttachMoneyIcon className="a-icon" color="success" />
            <div className="analytics-info">
              <h3>Ksh {data?.totalBudget || 0}</h3>
              <p variant="body1">Total Budget</p>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            <MonetizationOnIcon className="a-icon" />
            <div className="analytics-info">
              <h3>Ksh {data?.totalSpent || 0}</h3>
              <p variant="body1">Total Spent</p>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            <MoneyOffIcon className="a-icon" />
            <div className="analytics-info">
              <h3>Ksh {data?.remainingBudget || 0}</h3>
              <p variant="body1">Amount Remaining</p>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="analytics-container">
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <DoctorsIcon className={classes.statIcon} color="primary" /> */}
            <h3>{data?.total_bills_count || 0}</h3>
            <p variant="body1">Total Bills</p>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <AppointmentsIcon className={classes.statIcon} color="primary" /> */}
            <h3>{data?.pendingBillsCount || 0}</h3>
            <p variant="body1">Pending Bills</p>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <PatientsIcon className={classes.statIcon} color="primary" /> */}
            <h3>Ksh {data?.outgoingMoney}</h3>
            <p variant="body1">Total Pending</p>
          </Box>
        </Grid>
      </Grid>

<div className="bar-chart-container">

      <Chart
        totalAmountsSpent={data?.totalAmountsSpent}
        transactionAmounts={data?.transactionAmounts}
        categoryLabels={data?.categoryLabels}
        budgetAmounts={data?.budgetAmounts}
      />
    </div>

</div>

  );
};

export default Home;
