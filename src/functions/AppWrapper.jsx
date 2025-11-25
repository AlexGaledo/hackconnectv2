

import App from "../App";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";
import { MessageModalProvider } from "../context/MessageModal";

export default function AppWrapper(){
    return (
    <>
        <UserProvider>
        <MessageModalProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </MessageModalProvider>
        </UserProvider>
    </>
    )
}