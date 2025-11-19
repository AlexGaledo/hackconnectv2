import { ConnectButton, darkTheme } from "thirdweb/react";
import { client } from "../../main";
import './Navbar.css';
import hconnectLogo from '../../assets/hconnectlogo.jpg';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="Navbar">
      <div className="flex items-center gap-3">
        <img src={hconnectLogo} alt="HackConnect Logo" className="h-10 w-10 rounded-lg object-cover" />
        <h1>HackConnect</h1>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => navigate("/Dashboard")}>Dashboard</a></li>
        <li><a onClick={() => navigate("/Create")}>Create</a></li>
        <li><a onClick={() => navigate("/community")}>Community</a></li>
        <li><a onClick={() => navigate("/rewards")}>Rewards</a></li>
      </ul>
      <ConnectButton client={client}/>
    </div>
  );
}