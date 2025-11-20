import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";

export default function TicketList() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;

	useEffect(() => {
		if (!address) navigate("/");
	}, [address, navigate]);

	const short = (addr) => (addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : "");

	// Mock tickets (would be fetched from Firestore filtering walletAddress)
	const tickets = [
		{ id: "CBH-1", eventTitle: "ChainBuilders Hackathon", date: "Dec 02", tierName: "General", priceBought: 0, status: "valid" },
		{ id: "DCM-2", eventTitle: "DevConnect Meetup", date: "Dec 10", tierName: "VIP", priceBought: 10, status: "valid" },
		{ id: "OSS-3", eventTitle: "OpenSource Sprint", date: "Jan 14", tierName: "Supporter", priceBought: 5, status: "used" },
	];

	return (
		<div className="relative min-h-screen flex flex-col">
			<div className="absolute inset-0 z-0">
				{[0,1,2,3].map(i => (
					<div
						key={i}
						className="absolute rounded-xl bg-white/0 border border-white/5 backdrop-blur-md"
						style={{
							width: "336px",
							height: "100vh",
							top: 0,
							left: `${i * 25}%`,
							WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
							maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
						}}
					/>
				))}
			</div>

			<section className="relative z-10 pt-8 sm:pt-14 pb-2 px-4 sm:px-6">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
						<div>
							<h1
								className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
								style={{
									backgroundImage: "linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)",
								}}
							>
								Tickets
							</h1>
							<p className="text-gray-300/70 mt-2 text-sm sm:text-base">Owned by {address ? short(address) : 'wallet'}.</p>
						</div>
						<div className="flex gap-3">
							<button className={btnPrimary} onClick={() => navigate('/Create')}>Create Event</button>
							<button className={btnPrimary} onClick={() => navigate('/Dashboard')}>Back to Dashboard</button>
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-6">
				<div className="container mx-auto rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 h-full">
					<div className="flex items-center justify-between">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Your Tickets ({tickets.length})</h2>
					</div>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{tickets.map(t => (
							<div key={t.id} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition flex flex-col justify-between">
								<div>
									<div className="text-white font-medium">{t.eventTitle}</div>
									<div className="text-xs text-gray-300/70 mt-1">{t.date} • {t.tierName} Tier</div>
									<div className="text-xs text-gray-400 mt-1">Status: {t.status}</div>
									<div className="text-xs text-gray-400 mt-1">Price: {t.priceBought === 0 ? 'Free' : `${t.priceBought} $`}</div>
								</div>
								<button
									className="mt-4 h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm w-fit"
									onClick={() => navigate(`/Ticket?id=${t.id}`)}
								>View more</button>
							</div>
						))}
						{tickets.length === 0 && (
							<div className="text-xs text-gray-400 col-span-full">No tickets yet.</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
