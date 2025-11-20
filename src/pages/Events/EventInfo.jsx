import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";

// Detailed Event view using mock data (replace with Firestore fetch)
// Shows tiers with progress and basic actions placeholder
export default function EventInfo() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const [searchParams] = useSearchParams();
	const eventId = searchParams.get('id') || 'EVT-CBH-2025';

	useEffect(() => { if (!address) navigate('/'); }, [address, navigate]);

	// Same mock list as EventList (could centralize later)
	const mockEvents = [
		{
			id: "EVT-CBH-2025",
			hostAddress: "0x1234...ABCD",
			title: "ChainBuilders Winter Hackathon",
			description: "Collaborative build sprint focusing on tooling, infra and DX.",
			eventLink: "https://example.com/cbh",
			imageUrl: "https://placehold.co/800x360?text=Hackathon",
			startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
			endDate: new Date(Date.now() + 5 * 86400000).toISOString(),
			status: "upcoming",
			ticketTiers: [
				{ tierName: "General", price: 0, ticketCount: 200, ticketsSold: 48, hackRewards: 0 },
				{ tierName: "Supporter", price: 5, ticketCount: 60, ticketsSold: 14, hackRewards: 20 },
				{ tierName: "VIP", price: 10, ticketCount: 20, ticketsSold: 6, hackRewards: 50 },
			],
		},
		{
			id: "EVT-DEVCON-MEET",
			hostAddress: "0x9999...BEEF",
			title: "DevConnect Builders Meetup",
			description: "Casual networking + lightning talks on protocol design.",
			eventLink: "https://example.com/devmeet",
			imageUrl: "https://placehold.co/800x360?text=Meetup",
			startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
			endDate: new Date(Date.now() - 86400000).toISOString(),
			status: "completed",
			ticketTiers: [
				{ tierName: "General", price: 0, ticketCount: 150, ticketsSold: 150, hackRewards: 0 },
				{ tierName: "VIP", price: 8, ticketCount: 30, ticketsSold: 28, hackRewards: 25 },
			],
		},
		{
			id: "EVT-OSS-SPRINT",
			hostAddress: "0x8888...FEED",
			title: "Open Source Maintenance Sprint",
			description: "Focus on issue triage, docs polish, dependency updates.",
			eventLink: "https://example.com/oss-sprint",
			imageUrl: "https://placehold.co/800x360?text=Sprint",
			startDate: new Date(Date.now() - 86400000).toISOString(),
			endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
			status: "ongoing",
			ticketTiers: [
				{ tierName: "General", price: 0, ticketCount: 100, ticketsSold: 73, hackRewards: 0 },
				{ tierName: "Supporter", price: 4, ticketCount: 40, ticketsSold: 22, hackRewards: 15 },
			],
		},
	];

	const [event, setEvent] = useState(null);
	useEffect(() => {
		const found = mockEvents.find(e => e.id === eventId);
		setEvent(found || null);
	}, [eventId]);

	const fmtDate = (iso) => { try { return new Date(iso).toLocaleString(); } catch { return iso; } };
	const short = (addr) => (addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '');

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
				<div className="container mx-auto max-w-4xl">
					<button
						type="button"
						onClick={() => navigate('/Events')}
						className={`${btnPrimary} mb-6`}
					>Back to Events</button>
					<h1
						className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
						style={{ backgroundImage: "linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)" }}
					>
						Event Details
					</h1>
					{event && <p className="text-xs text-gray-400 mt-2">Event ID: {event.id}</p>}
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-6">
				<div className="container mx-auto max-w-4xl space-y-6 h-full">
					{!event ? (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 text-center text-gray-400">Loading event...</div>
					) : (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
							<div className="space-y-4">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="flex-1 space-y-3">
										<div className="text-white font-medium text-lg">{event.title}</div>
										<div className={`text-xs font-medium capitalize ${event.status === 'upcoming' ? 'text-green-300' : event.status === 'ongoing' ? 'text-yellow-300' : event.status === 'completed' ? 'text-gray-300' : 'text-red-300'}`}>{event.status}</div>
										<div className="text-xs text-gray-300/70">Starts: {fmtDate(event.startDate)}</div>
										<div className="text-xs text-gray-300/70">Ends: {fmtDate(event.endDate)}</div>
										<p className="text-xs text-gray-300/80 leading-relaxed">{event.description}</p>
										<div className="text-xs text-gray-400">Host: {event.hostAddress}</div>
										<a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:underline">Visit Event Link</a>
									</div>
									<div className="md:w-64 w-full">
										<div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center text-xs text-gray-400">
											Image Placeholder
										</div>
									</div>
								</div>

								<div>
									<div className="text-sm font-semibold text-white mb-3">Ticket Tiers</div>
									<div className="space-y-3">
										{event.ticketTiers.map(tier => {
											const pct = Math.min(100, Math.round((tier.ticketsSold / tier.ticketCount) * 100));
											return (
												<div key={tier.tierName} className="border border-white/10 rounded-lg p-3 bg-white/0">
													<div className="flex items-center justify-between">
														<div className="text-white/90 text-sm font-medium">{tier.tierName}</div>
														<div className="text-xs text-gray-300/70">{tier.price === 0 ? 'Free' : `${tier.price} $`} • Rewards {tier.hackRewards}</div>
													</div>
													<div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
														<div className="h-full bg-gradient-to-r from-green-400/60 to-green-200/40" style={{ width: `${pct}%` }} />
													</div>
													<div className="mt-1 flex justify-between text-[10px] text-gray-400">
														<span>{tier.ticketsSold} sold</span>
														<span>{tier.ticketCount - tier.ticketsSold} left</span>
													</div>
													<button
														className="mt-3 h-8 px-3 rounded-full border border-white/10 text-white/80 hover:bg-white/10 text-xs"
														onClick={() => alert(`Buy ${tier.tierName} (demo)`)}
													>Buy Tier</button>
												</div>
											);
										})}
									</div>
								</div>

								<p className="text-[11px] text-gray-500">Actions are placeholders; integrate Firestore & purchase flow later.</p>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
