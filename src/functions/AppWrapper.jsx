

import App from "../App";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";

export default function AppWrapper(){
    return (
    <>
    <UserProvider>
    <HashRouter>
        <App />
    </HashRouter>     
    </UserProvider>   
    </>
    )
}