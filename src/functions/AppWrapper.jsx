

import App from "../App";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "../context/UserContext";
import { MessageModalProvider } from "../context/MessageModal";
import ChatbotWidget from "../components/Chatbot/ChatbotWidget";

export default function AppWrapper(){
    return (
    <>
        <UserProvider>
        <MessageModalProvider>
            <HashRouter>
                <App />
            </HashRouter>
            <ChatbotWidget />
        </MessageModalProvider>
        </UserProvider>
    </>
    )
}