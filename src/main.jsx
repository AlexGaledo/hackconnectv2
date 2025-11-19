import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './functions/AppWrapper.jsx'
import { createThirdwebClient } from 'thirdweb'
import { ThirdwebProvider } from 'thirdweb/react'


const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
export const client = createThirdwebClient({
  clientId:clientId
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider client={client}>
    <App />
    </ThirdwebProvider>
  </StrictMode>,
)
