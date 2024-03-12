import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()


const AppProvider = ({children}) => {

    const [snackbarOpen,setSnackbarOpen] = useState(false)
    const navigate = useNavigate()

    function closeSnackbar(event,reason){
        if (reason === 'clickaway') {
            return;
          }
      
          setSnackbarOpen(false);
    }
    function openSnackbar(){
        setSnackbarOpen(true)
    }

    const handleNavigate = (destination) => {
        navigate(destination)
        }
  return (
    <AppContext.Provider value={{snackbarOpen,closeSnackbar,openSnackbar,handleNavigate}}>
        {children}
    </AppContext.Provider>
  )
}

export default AppProvider