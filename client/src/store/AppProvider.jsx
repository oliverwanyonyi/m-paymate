import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()


const AppProvider = ({children}) => {

    const [snackbarOpen,setSnackbarOpen] = useState(false)
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
    <AppContext.Provider value={{snackbarOpen,closeSnackbar,openSnackbar,handleNavigate, isOpen, handleOpen, handleClose  }}>
        {children}
    </AppContext.Provider>
  )
}

export default AppProvider