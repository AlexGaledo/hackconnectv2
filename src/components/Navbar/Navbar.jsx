import { ConnectButton, darkTheme, useActiveWallet } from "thirdweb/react";
import { client } from "../../main";
import './Navbar.css';
import hconnectLogo from '../../assets/hconnectlogo.jpg';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getContract, defineChain } from "thirdweb";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useReadContract } from "thirdweb/react";

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const wallet = useActiveWallet();

  // Hack Connect Contract
  const Hconnectcontract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0x02ae1DeCC0A1e36F026adD5c1faA455116f22260",
  });

  const { data: hackBalance } = useReadContract(
    balanceOf,
    {
      contract: Hconnectcontract,
      address: wallet?.getAccount()?.address || "0x0",
    }
  );

  const formattedBalance = hackBalance 
    ? (Number(hackBalance) / 1e18).toFixed(2) 
    : "0.00";


  return (
    <div className={`Navbar ${isOpen ? 'open' : ''}`}>
      <div className="flex items-center gap-3 brand">
        <img src={hconnectLogo} alt="HackConnect Logo" className="h-10 w-10 rounded-lg object-cover" />
        <h1>HackConnect</h1>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => navigate("/Dashboard")}>Dashboard</a></li>
        <li><a onClick={() => navigate("/Create")}>Create</a></li>
        <li><a onClick={() => navigate("/Events")}>Events</a></li>
        <li><a onClick={() => navigate("/Community")}>Community</a></li>
        <li><a onClick={() => navigate("/Rewards")}>Rewards</a></li>
      </ul>
      <div className="connect-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate('/Profile')}
          className="h-10 w-10 rounded-full border border-white/20 hover:border-white/40 flex items-center justify-center text-white/90 hover:text-white transition"
          style={{ flexShrink: 0 }}
          title="Profile Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>
        <ConnectButton 
          client={client}
          detailsButton={{
            displayBalanceToken: {
              [11155111]: "0x02ae1DeCC0A1e36F026adD5c1faA455116f22260"
            }
          }}
        />
      </div>

      <button
        className="mobile-toggle"
        aria-label="Toggle menu"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(v => !v)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      <div id="mobile-menu" className="mobile-menu" role="menu">
        <ul>
          <li><a onClick={() => { navigate('/Dashboard'); setIsOpen(false); }}>Dashboard</a></li>
          <li><a onClick={() => { navigate('/Create'); setIsOpen(false); }}>Create</a></li>
          <li><a onClick={() => { navigate('/Community'); setIsOpen(false); }}>Community</a></li>
          <li><a onClick={() => { navigate('/Rewards'); setIsOpen(false); }}>Rewards</a></li>
          <li><a onClick={() => { navigate('/Profile'); setIsOpen(false); }}>Profile</a></li>
        </ul>
        <div className="connect-mobile">
          <ConnectButton 
            client={client}
            detailsButton={{
              displayBalanceToken: {
                [11155111]: "0x02ae1DeCC0A1e36F026adD5c1faA455116f22260"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}