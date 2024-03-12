import React, { useContext, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaCircleUser, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AuthContext } from "../store/AuthProvider";

const UserNav = () => {
    const [isSubnavOpen, setIsSubnavOpen] = useState(false);
    const subnavRef = useRef(null);
    const {logout,authUser} = useContext(AuthContext)
    const toggleSubnav = () => {
        setIsSubnavOpen(!isSubnavOpen);
      };

      const handleLogout = ()=>{
        logout()
      }

    const handleClickOutside = (event) => {
       
        if (subnavRef.current && !subnavRef.current.contains(event.target)) {
        console.log(event);

          setIsSubnavOpen(false);
        }
      };

      useEffect(() => {
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
  return (
    <div className="user-nav">
      <div>
        <Link className="sidebar-brand nav-brand">M-Paymate</Link>
      </div>

      <ul className="nav-links">
        <li className={`nav-link-item ${isSubnavOpen && 'nav-link-active'}`} onClick={toggleSubnav}>
          
          <div className="link-text">
            <div className="text">
              <FaCircleUser className="icon" /> {authUser?.name}
            </div>
            <FaChevronDown />
          </div>

          <div className="nav-sub-items" ref={subnavRef}>
          <div className="link-text">
            <Link className="text" to='/profile'>
              Profile
            </Link>
          
          </div>
          <div className="link-text">
            <div className="text" onClick={handleLogout}>
               Logout
            </div>
          
          </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UserNav;
