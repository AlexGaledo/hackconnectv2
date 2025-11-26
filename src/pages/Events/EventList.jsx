import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { useUser } from "../../context/UserContext";
import { connector } from "../../api/axios";

// Browse Events page with search + filters
// Schema reference used for mock data
export default function EventList() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const { events, user } = useUser();
	const { addEvents } = useUser();

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
	

	useEffect(() => { if (!address) navigate("/");}, [address, navigate]);
	useEffect(() => { retrieveEventOverview(); }, []);


	// Filters state
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');

	const filteredEvents = useMemo(() => {
		return events.filter(ev => {
			const term = search.toLowerCase();
			const matchesSearch = !term || (ev.event_title?.toLowerCase().includes(term) || ev.description?.toLowerCase().includes(term));
			const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
			// Price filter: match if ANY tier falls inside range
			const anyTierWithin = Array.isArray(ev.ticketTiers) && ev.ticketTiers.length > 0
				? ev.ticketTiers.some(tier => {
					const minOK = minPrice === '' || tier.price >= Number(minPrice);
					const maxOK = maxPrice === '' || tier.price <= Number(maxPrice);
					return minOK && maxOK;
				})
				: true; // If no tiers, include by default
			return matchesSearch && matchesStatus && anyTierWithin;
		});
	}, [search, statusFilter, minPrice, maxPrice, events]);

	const short = (addr) => (addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : "");
	const fmt = (iso) => { try { return new Date(iso).toLocaleDateString(); } catch { return iso; } };

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
								style={{ backgroundImage: "linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)" }}
							>
								Browse Events
							</h1>
							<p className="text-gray-300/70 mt-2 text-sm sm:text-base">Connected as {address ? short(address) : 'wallet'}.</p>
						</div>
						<div className="flex gap-4"><button className={btnPrimary} onClick={() => navigate('/Dashboard')}>Back to Dashboard</button></div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-6">
				<div className="container mx-auto rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 h-full flex flex-col">
					{/* Filters */}
					<div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
						<div className="flex flex-wrap gap-3 items-end">
							<div className="flex flex-col">
								<label className="text-xs text-gray-300/60 mb-1">Search</label>
								<input
									value={search}
									onChange={e => setSearch(e.target.value)}
									placeholder="Title or description..."
									className="h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/90 text-sm focus:outline-none focus:border-white/20"
								/>
							</div>
							<div className="flex flex-col">
								<label className="text-xs text-gray-300/60 mb-1">Status</label>
								<select
									value={statusFilter}
									onChange={e => setStatusFilter(e.target.value)}
									className="h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/90 text-sm focus:outline-none focus:border-white/20"
								>
									<option value="all">All</option>
									<option value="upcoming">Upcoming</option>
									<option value="ongoing">Ongoing</option>
									<option value="completed">Completed</option>
									<option value="postponed">Postponed</option>
								</select>
							</div>
							<div className="flex flex-col w-24">
								<label className="text-xs text-gray-300/60 mb-1">Min Price</label>
								<input
									type="number"
									value={minPrice}
									onChange={e => setMinPrice(e.target.value)}
									className="h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/90 text-sm focus:outline-none focus:border-white/20"
								/>
							</div>
							<div className="flex flex-col w-24">
								<label className="text-xs text-gray-300/60 mb-1">Max Price</label>
								<input
									type="number"
									value={maxPrice}
									onChange={e => setMaxPrice(e.target.value)}
									className="h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/90 text-sm focus:outline-none focus:border-white/20"
								/>
							</div>
							<button
								onClick={() => { setSearch(''); setStatusFilter('all'); setMinPrice(''); setMaxPrice(''); }}
								className="h-9 px-4 rounded-full border border-white/10 text-white/80 hover:bg-white/10 text-sm"
							>Reset</button>
						</div>
						<div className="text-xs text-gray-400">Showing {filteredEvents.length} of {events.length} events</div>
						
					</div>

					{/* Events grid */}
					<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredEvents.map(ev => {
							const cheapest = Array.isArray(ev.ticketTiers) && ev.ticketTiers.length > 0
								? ev.ticketTiers.reduce((min, t) => t.price < min ? t.price : min, ev.ticketTiers[0]?.price || 0)
								: 0;
	                        const hasFree = Array.isArray(ev.ticketTiers) && ev.ticketTiers.some(t => t.price === 0);
							return (
								<div key={ev.event_id || ev.id} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition flex flex-col">
									<div className="flex-1">
										<div className="text-white font-medium line-clamp-2">{ev.event_title}</div>
										<div className="text-xs text-gray-300/70 mt-1">{fmt(ev.date_start)} – {fmt(ev.date_end)}</div>
										<div className={`text-xs mt-1 font-medium capitalize ${ev.status === 'upcoming' ? 'text-green-300' : ev.status === 'ongoing' ? 'text-yellow-300' : ev.status === 'completed' ? 'text-gray-300' : 'text-red-300'}`}>{ev.status}</div>
										<div className="text-xs text-gray-400 mt-1 line-clamp-3">{ev.description}</div>
										<div className="text-xs text-gray-300/60 mt-2">{hasFree ? 'Free' : `Cheapest: ${cheapest} $`}</div>
										<div className="mt-2 flex flex-wrap gap-1">
											{Array.isArray(ev.ticketTiers) && ev.ticketTiers.length > 0 && ev.ticketTiers.slice(0,3).map(t => (
												<span key={t.tierName} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
													{t.tierName}: {t.price === 0 ? 'Free' : `${t.price}$`}
												</span>
											))}
										</div>
									</div>
									
									<button
										className="mt-4 h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm w-fit"
										onClick={() => navigate(`/Event/${ev.event_id || ev.id}`)}
									>View more</button>
								</div>
								
							);
						})}	

						{filteredEvents.length === 0 && (
							<div className="text-xs text-gray-400 col-span-full">No events match your filters.</div>
						)}
					</div>

				</div>
				
			</section>
		</div>
	);
}
