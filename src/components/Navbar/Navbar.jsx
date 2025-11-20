import { ConnectButton, darkTheme } from "thirdweb/react";
import { client } from "../../main";
import './Navbar.css';
import hconnectLogo from '../../assets/hconnectlogo.jpg';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`Navbar ${isOpen ? 'open' : ''}`}>
      <div className="flex items-center gap-3 brand">
        <img src={hconnectLogo} alt="HackConnect Logo" className="h-10 w-10 rounded-lg object-cover" />
        <h1>HackConnect</h1>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => navigate("/Dashboard")}>Dashboard</a></li>
        <li><a onClick={() => navigate("/Create")}>Create</a></li>
        <li><a onClick={() => navigate("/Community")}>Community</a></li>
        <li><a onClick={() => navigate("/Rewards")}>Rewards</a></li>
      </ul>
      <div className="connect-desktop">
        <ConnectButton client={client}/>
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
        </ul>
        <div className="connect-mobile">
          <ConnectButton client={client} />
        </div>
      </div>
    </div>
  );
}