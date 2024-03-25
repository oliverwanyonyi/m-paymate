import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import RateReviewIcon from '@mui/icons-material/RateReview';
import whitelogo from '../assets/mpaymate-white.png'
import { AuthContext } from '../store/AuthProvider';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { MdDashboard } from 'react-icons/md';
const Sidebar = () => {
const location = useLocation()
const {authUser} = useContext(AuthContext)
// console.log(authUser);

   function getActivePath(path){
         if(path === location.pathname){
         
            return 'active'
         }else {
            return ''
         }
   }
  return (
    <div className='sidebar'>
    <div>
        <Link className="sidebar-brand">
         
         <img src={whitelogo} alt="" />
        </Link>
    </div>


<div className="sidebar-links-container">

   <ul className="sidebar-links">
   
      {authUser?.role === "user" ?
      
   <>
   
   <li className="sidebar-link-item">
       <Link to='/dashboard' className={`sidebar-link ${getActivePath('/dashboard')}`}> <div className="link-icon">  <MdDashboard /></div> <div className="link-text"> Dashboard</div>
       </Link>
    </li>
    <li className="sidebar-link-item">
       <Link to='/bills' className={`sidebar-link ${getActivePath('/bills')}`}> <div className="link-icon"><FaMoneyBillTrendUp/></div> <div className="link-text"> Bills</div>
       </Link>
    </li>
    <li className="sidebar-link-item">
       <Link to='/budget/list' className={`sidebar-link ${getActivePath('/budget/list')}`}> <div className="link-icon"><FaFileInvoiceDollar/></div> <div className="link-text"> My Budgets</div>
       </Link>
    </li>

    <li className="sidebar-link-item">
       <Link to='/expenditure/list' className={`sidebar-link ${getActivePath('/expenditure/list')}`}> <div className="link-icon">< FaWallet/></div> <div className="link-text">Expenditures</div>
       </Link>
    </li>
   
   </>
   :
   <>
   <li className="sidebar-link-item">
   <Link to='/admin/dashboard' className={`sidebar-link ${getActivePath('/admin/dashboard')}`}> <div className="link-icon">  < DashboardIcon /></div> <div className="link-text">Dashboard  {authUser?.role}</div>
   </Link>
</li>
<li className="sidebar-link-item">
   <Link to='/admin/users' className={`sidebar-link ${getActivePath('/admin/users')}`}> <div className="link-icon">  <PeopleAltIcon/></div> <div className="link-text">Users</div>
   </Link>
</li>

<li className="sidebar-link-item">
   <Link to='/admin/testimonials' className={`sidebar-link ${getActivePath('/admin/testimonials')}`}> <div className="link-icon">  <RateReviewIcon /></div> <div className="link-text">Testimonials</div>
   </Link>
</li>
</>

   }

  
   
   </ul>
</div>
</div>


  )
}

export default Sidebar