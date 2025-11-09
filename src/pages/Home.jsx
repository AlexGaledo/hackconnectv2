import { auth, provider, signInWithPopup } from "../services/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { btnPrimary } from "../styles/reusables";

export default function Home() {
  const { user, setUser } = useUser();

  const handleGoogleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Signed in user:', result.user);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        
        alert(`Welcome, ${user.displayName}`);         
        setUser({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            walletAddress: null,
        });

      } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      }
    }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-grey-100 to-red-100">
      <h1>Welcome to the HackConnect Home Page</h1>
      <button className={btnPrimary}
        onClick={handleGoogleSignIn}>
        {!user?"Sign in with Google":"Signed in as "+user.name}
      </button>
    </div>
  );
}