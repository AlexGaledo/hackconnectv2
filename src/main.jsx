import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './functions/AppWrapper.jsx'
import { createThirdwebClient, getContract } from 'thirdweb'
import { ThirdwebProvider } from 'thirdweb/react'
import { defineChain } from "thirdweb/chains";



// connect to your contract
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
export const client = createThirdwebClient({
  clientId:clientId
});

// hack token contract (burn simulation)
export const hackTokenContract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x02ae1DeCC0A1e36F026adD5c1faA455116f22260",
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider client={client}>
    <App />
    </ThirdwebProvider>
  </StrictMode>,
)
