
import { useUser } from "../context/UserContext";
import { btnPrimary, colorPrimary } from "../styles/reusables";
import { ConnectButton, darkTheme, useActiveWallet } from "thirdweb/react";
import { client } from "../main";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const features = [
  {
    title: "Join Tech Events",
    description: "Participate in hackathons, workshops, and meetups designed for tech enthusiasts.",
    detail: "Connect with developers, designers, and innovators to expand your network.",
  },
  {
    title: "Project Showcase",
    description: "Showcase your hackathon projects and get noticed by companies and recruiters.",
    detail: "Build your portfolio and highlight your skills with every hack.",
  },
  {
    title: "Community & Rewards",
    description: "Join a vibrant community of builders and earn rewards for your contributions.",
    detail: "Collaborate, compete, and celebrate achievements together in a supportive environment.",
  },
];


export default function Home() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const walletAddress = useActiveWallet();

  useEffect(() => {
    if (walletAddress) {
      console.log("Wallet connected:", walletAddress.address);
      navigate("/Dashboard");
    } else {
      console.log("No wallet connected. Redirecting to connect wallet.");
    }
  },[]);
  
  const activeWallet = useActiveWallet();
  const isConnected = activeWallet?.getAccount()?.address;
  
  const getStarted = () =>{
    if(activeWallet){
      console.log("Wallet connected:", activeWallet.address);
      navigate("/Dashboard");
    }
    else{
      console.log("No wallet connected. Redirecting to connect wallet.");
    }
  }
  

  return (
    <div className="relative">
      {/* Shared Background */}
      <div className="absolute inset-0 z-0">
        {/* Glassmorphic vertical rectangles */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-xl bg-white/5 border border-white/10 backdrop-blur-3xl"
            style={{
              width: "336px",
              height: "900px",
              top: 0, 
              left: `${i * 25}%`,
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen sm:min-h-[80vh] flex items-center justify-center overflow-hidden z-10 pt-10 sm:pt-24 pb-12 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          {/* Glassmorphic Badge
          <div
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 mb-6 sm:mb-8 tracking-tight"
            style={{
              boxShadow: "inset 0 2px 12px rgba(255, 255, 255, 0.04)"
            }}
          >
            <span className="text-xs sm:text-sm text-gray-300">🚀 Connect. Build. Conquer.</span>
          </div> */}

          {/* Heading */}
          <h1
            className="text-5xl sm:text-7xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent leading-tight tracking-tight"
            style={{
              backgroundImage: "linear-gradient(to bottom, #B4AFA8 0%, #E5E5E5 56%, #E5E5E5 75%, #FFFFFF 100%)",
            }}
          >
            Unleashing Innovation <br/> through Connection.   
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300/70 mb-8 sm:mb-10 max-w-2xl sm:max-w-4xl mx-auto tracking-tight px-2 sm:px-0">
            HackConnect helps you find tech events, showcase projects, and connect with like-minded innovators.
          </p>

          {/* CTA Button with Connect Wallet Logic */}
          {isConnected ? (
            <button 
              className={btnPrimary + " mx-auto"}
              onClick={getStarted}
            >
              <span>Get Started</span>
            </button>
          ) : (
            <div className={btnPrimary + " mx-auto"}>
              <ConnectButton
                client={client}
                theme={darkTheme({
                  colors: {
                    primaryButtonText: "#FFFFFF",
                    primaryButtonBg: "transparent",
                    secondaryButtonHoverBg: "rgba(255, 255, 255, 0.1)",
                  },
                })}
                connectButton={{
                  label: "Get Started",
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-8 sm:py-16 lg:py-24 px-4 sm:px-6 z-10">
        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16 bg-gradient-to-t from-white via-white/70 to-white/80 bg-clip-text text-transparent leading-tight">
            Everything you need to<br className="hidden sm:inline" />
            <span className="block sm:inline"> explore at HackConnect</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative h-auto sm:h-72 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6 sm:p-8 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-left">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300/60 mb-4 sm:mb-6 text-left line-clamp-3 sm:line-clamp-none">{feature.description}</p>
                <p className="text-xs sm:text-sm text-gray-300/80 text-left">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}