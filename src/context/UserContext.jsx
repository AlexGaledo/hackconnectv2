import { createContext, useContext } from "react"
import { useState } from "react"


const UserContext = createContext(null);

export function UserProvider({children}){
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState([]);

    const addUser = (userData) => {
        if(!userData || Object.keys(userData).length === 0){
            console.error("No user data provided to addUser");
            return;
        }
        
        setUser({
            walletAddress: userData.walletAddress || null,
            displayName: userData.username || "Anonymous",
            email: userData.email || null,
            profilePicture: userData.profileUrl || null,
            reputation: userData.reputation || 0,
            eventsParticipated: userData.eventsJoined || 0
        });
    }

    const updateUser = (updatedData) => {
        try{
            if(!user || Object.keys(updatedData).length === 0){
                throw new Error("No user to update or no data provided");
            }
        } catch (error){
            console.error("Error updating user data:", error);
            return
        }

        setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
        }));     
    }

    const addTickets = (ticketsData) => {
        if(!ticketsData || !Array.isArray(ticketsData)){
            console.error("Invalid tickets data provided to addTickets");
            return;
        }
        setTickets(ticketsData);
    }

    const addEvents = (eventsData) => {
        if(!eventsData || !Array.isArray(eventsData)){
            console.error("Invalid events data provided to addEvents");
            return;
        }
        setEvents(eventsData);
    }

    return(
        <>
        <UserContext.Provider value={{ user, setUser, addUser, updateUser, tickets, 
            setTickets, addTickets, events, setEvents, addEvents }}>
            {children}
        </UserContext.Provider>
        </>
    )
}

export const useUser = () => useContext(UserContext)