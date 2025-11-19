import { createContext, useContext } from "react"
import { useState } from "react"


const UserContext = createContext(null);

export function UserProvider({children}){
    const [user, setUser] = useState(null);

    const addUser = (userData) => {
        // try{
        //     if(!userData.uid || !userData.displayName || !userData.email){
        //         throw new Error("Missing required user fields");
        //     }
        // } catch (error){
        //     console.error("Error adding user:", error);
        //     return;
        // }

        setUser({
            walletAddress: userData.walletAddress || null,
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


    return(
        <>
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
        </>
    )
}

export const useUser = () => useContext(UserContext)