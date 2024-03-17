import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";

const Sidebar = () => {
const location = useLocation()


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
        <Link className="sidebar-brand">M-Paymate</Link>
    </div>


<div className="sidebar-links-container">

   <ul className="sidebar-links">
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
   </ul>
</div>
</div>


  )
}

export default Sidebar