import {createContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();
const AuthProvider = ({children}) => {
    const [authUser,setAuthUser] = useState()
    const [isAuth,setIsAuth] = useState(false)
    const navigate = useNavigate()
    function logout(){
      localStorage.removeItem('auth_user');
      setAuthUser(null)
      setIsAuth(false)
      navigate('/login') 
    }

  
    useEffect(()=>{
        const user = localStorage.getItem('auth_user')?JSON.parse(localStorage.getItem('auth_user')):null
        setAuthUser(user)
        if(user){
            setIsAuth(true)
        }
    },[])
  return (
    <AuthContext.Provider value={{authUser,setAuthUser,isAuth,setIsAuth,logout, }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider