import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../axios/axios'
import { Box, Grid } from '@mui/material'

const AdminDashboard = () => {

    const [data,setData] =useState()


    async function getAnalyticsData(){

const {data} = await axiosInstance.get('/analytics')

console.log(data);
setData(data)

    }

    useEffect(()=>{
    getAnalyticsData()
    }, [])
  return (
    <div>
        
        <Grid container spacing={3} className="analytics-container">


        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <DoctorsIcon className={classes.statIcon} color="primary" /> */}
            <h3>{data?.userCount}</h3>
            <p variant="body1">Users</p>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <AppointmentsIcon className={classes.statIcon} color="primary" /> */}
            <h3>{data?.activeUserCount}</h3>
            <p variant="body1">Active Users</p>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="analytics-item">
            {/* <PatientsIcon className={classes.statIcon} color="primary" /> */}
            <h3>{data?.testimonialCount}</h3>
            <p variant="body1">Testimonials</p>
          </Box>
        </Grid>

            </Grid>
    </div>
  )
}

export default AdminDashboard