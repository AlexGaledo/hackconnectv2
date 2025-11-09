

import App from "../App";
import { BrowserRouter } from "react-router-dom";


export default function AppWrapper(){
    return (
    <>
    <BrowserRouter>
        <App />
    </BrowserRouter>        
    </>
    )
}