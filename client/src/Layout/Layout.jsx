import React from 'react'
import Sidebar from '../components/Sidebar'
import UserNav from '../components/UserNav'

const Layout = ({children}) => {
  return (
    <div>
        
        <div className="main">
            <div className="main-container">
            <Sidebar/>
            <div className="main-area">
                <UserNav/>
                <div className="main-content">
                 
                  { children}

                

                </div>

            </div>

            </div>

        </div>
        
        </div>
  )
}

export default Layout