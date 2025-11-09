

import App from "../App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext";

export default function AppWrapper(){
    return (
    <>
    <UserProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>     
    </UserProvider>   
    </>
    )
}