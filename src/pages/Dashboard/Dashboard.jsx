import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";

export default function Dashboard() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;

	useEffect(() => {
		if (!address) {
			navigate("/");
		}
	}, [address, navigate]);

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

	// Mock tickets referencing Events schema fields
	const tickets = [
		{ id: "CBH-1", event: "ChainBuilders Hackathon", tierName: "General", price: 0, ticketCount: 1, status: "valid", date: "Dec 02" },
		{ id: "DCM-2", event: "DevConnect Meetup", tierName: "VIP", price: 10, ticketCount: 1, status: "valid", date: "Dec 10" },
	];

	return (
		<div className="relative">
			<div className="absolute inset-0 z-0">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="absolute rounded-xl bg-white/0 border border-white/5 backdrop-blur-md"
						style={{
							width: "336px",
							height: "900px",
							top: 0,
							left: `${i * 25}%`,
							WebkitMaskImage:
								"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
							maskImage:
								"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
						}}
					/>
				))}
			</div>

			<section className="relative z-10 pt-10 sm:pt-16 pb-6 sm:pb-10 px-4 sm:px-6">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
						<div>
							<h1
								className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
								style={{
									backgroundImage:
										"linear-gradient(to bottom, #d7dee4 0%, #eef1f4 60%, #ffffff 100%)",
								}}
							>
								Dashboard
							</h1>
							<p className="text-gray-300/70 mt-2 text-sm sm:text-base">
								Welcome{address ? `, ${short(address)}` : ""}. Track activity and get building.
							</p>
						</div>
                        
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					<div className="rounded-2xl backdrop-blur-sm bg-white/10/5 bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.09] transition">
						<div className="text-sm text-gray-300/70">Events Joined</div>
						<div className="text-4xl font-bold text-white mt-2">3</div>
						<div className="text-xs text-gray-300/60 mt-2">+1 this month</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.09] transition">
						<div className="text-sm text-gray-300/70">Projects</div>
						<div className="text-4xl font-bold text-white mt-2">2</div>
						<div className="text-xs text-gray-300/60 mt-2">1 in review</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.09] transition">
						<div className="text-sm text-gray-300/70">Reputation</div>
						<div className="text-4xl font-bold text-white mt-2">740</div>
						<div className="text-xs text-gray-300/60 mt-2">+40 this week</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10">
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					<div className="lg:col-span-2 rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">Upcoming Events</h2>
							<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/Events")}>View all upcoming events</button>
						</div>
						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							{[{
								name: "ChainBuilders Hackathon",
								date: "Dec 02",
								location: "Online",
							}, {
								name: "DevConnect Meetup",
								date: "Dec 10",
								location: "Makati",
							}].map((e, i) => (
								<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-white font-medium">{e.name}</div>
											<div className="text-xs text-gray-300/70 mt-1">{e.date} • {e.location}</div>
										</div>
										<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm">Join</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">Your Tickets</h2>
							<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/Tickets")}>view all tickets</button>
						</div>
						<div className="mt-4 space-y-3">
							{tickets.map((t) => (
								<div key={t.id} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-start justify-between">
										<div>
											<div className="text-white font-medium">{t.event}</div>
											<div className="text-xs text-gray-300/70 mt-1">{t.date} • {t.tierName} Tier</div>
											<div className="text-xs text-gray-400 mt-1">Status: {t.status}</div>
										</div>
										<div className="text-right">
											<div className="text-white/90 text-sm">{t.price === 0 ? 'Free' : `${t.price} $`}</div>
											<button className="mt-2 h-8 px-3 rounded-full border border-white/10 text-white/80 hover:bg-white/10 text-xs" onClick={() => navigate("/Ticket")}>View more</button>
										</div>
									</div>
								</div>
							))}
							{tickets.length === 0 && (
								<div className="text-xs text-gray-400">No tickets yet. Join an event to get started.</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10 pb-10 sm:pb-16">
				<div className="container mx-auto rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Your Projects</h2>
						<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/")}>New</button>
					</div>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						{["DeFi Wallet Analytics", "NFT Ticketing", "AI Hack Helper"].map((name, i) => (
							<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
								<div className="text-white font-medium">{name}</div>
								<div className="text-xs text-gray-300/70 mt-1">Draft • Updated 2d ago</div>
								<button className="mt-4 h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm w-fit">Open</button>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

