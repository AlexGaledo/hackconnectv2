import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { connector } from "../../api/axios";
import { useUser } from "../../context/UserContext";

export default function Dashboard() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address ?? null;
	const { addUser, user, addTickets, tickets, events, addEvents } = useUser();

	

	const retrieveUserData = async () => {
		if (!address) return; // prevent calling backend with null
		try {
			const response = await connector.post(`/users/retrieveWalletInfo/`,{
				walletAddress: address
			});

			const ticketResponse = await connector.get(`/events/retrieveTickets/${address}`);
			console.log("Ticket data:", ticketResponse.data.wallet_address);
			console.log("Tickets:", ticketResponse.data.tickets);
			addTickets(ticketResponse.data.tickets);

			console.log("User data:", response.data);

			if (response.status === 200) {
				addUser(response.data);
			}
			
			
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	};


	const retrieveEventOverview = async () => {
		try {
			const response = await connector.get(`/events/listEvents`);
			console.log("Event overview data:", response.data.events);

			if (response.status === 200) {
				addEvents(response.data.events);
			}
		} catch (error) {
			console.error("Error fetching event overview data:", error);
		}
	}

	

	useEffect(() => {
	if (!address) {
		navigate("/");
		return; // Stop if no address
	}
	retrieveUserData();
	retrieveEventOverview();
	}, [address, navigate]);


	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

	const viewEventInfo = (eventId) => {
		navigate(`/Event/${eventId}`);
	}
	
	



	return (
		<div className="relative" >
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
						<div className="text-4xl font-bold text-white mt-2">{user?.eventsParticipated || 0}</div>
						<div className="text-xs text-gray-300/60 mt-2">{`+ ${user?.eventsParticipated || 0} this week`}</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.09] transition">
						<div className="text-sm text-gray-300/70">Projects</div>
						<div className="text-4xl font-bold text-white mt-2">{user?.projects || 0}</div>
						<div className="text-xs text-gray-300/60 mt-2">{`+ ${user?.projects || 0} this week`}</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.09] transition">
						<div className="text-sm text-gray-300/70">Reputation</div>
						<div className="text-4xl font-bold text-white mt-2">{user?.reputation || 0}</div>
						<div className="text-xs text-gray-300/60 mt-2">{`+ ${user?.reputation || 0} this week`}</div>
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
							{events.slice(0,2).map((e, i) => (
								<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-white font-medium">{e.event_title}</div>
											<div className="text-xs text-gray-300/70 mt-1">{e.event_id} - {e.status}</div>
										</div>
										<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm"
										onClick={() => viewEventInfo(e.event_id)}
										>View more</button>
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
							{tickets.slice(0,2).map((t) => (
								<div key={t.id || `${t.eventId}-${t.tierName}`} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-start justify-between">
										<div>
											<div className="text-white font-medium">{t.eventId}</div>
											<div className="text-xs text-gray-300/70 mt-1">{t.tierName}</div>
											<div className="text-xs text-gray-400 mt-1">Status: {t.status}</div>
										</div>
										<div className="text-right">
											<div className="text-white/90 text-sm">{t.priceBought === 0 ? 'Free' : `${t.priceBought} $`}</div>
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
						{["DeFi Wallet Analytics", "NFT Ticketing", "AI Hack Helper"].map((name) => (
							<div key={name} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
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

