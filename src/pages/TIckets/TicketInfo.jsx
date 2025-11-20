import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";

// This page displays ticket info matching the Tickets schema
// Tickets (Collection)
//  uid (Document)
//   walletAddress: string
//   eventId: string
//   tierName: string
//   priceBought: number
//   purchasedAt: timestamp
//   status: string (valid/used/refunded)
//   ticketQRCode?: string

export default function TicketInfo() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const [searchParams] = useSearchParams();
	const ticketId = searchParams.get("id") || "CBH-1"; // fallback mock id

	// Mock lookup (replace with Firestore fetch later)
	const [ticket, setTicket] = useState(null);

	useEffect(() => {
		if (!address) navigate("/");
	}, [address, navigate]);

	useEffect(() => {
		// Simulate fetch
		const mock = {
			id: ticketId,
			walletAddress: address || "0xDEMO000000000000000000000000000000123456",
			eventId: "event_cb_winter_2025",
			tierName: "General",
			priceBought: 0,
			purchasedAt: new Date(Date.now() - 86400000).toISOString(),
			status: "valid",
			ticketQRCode: `QR-${ticketId}-${Math.random().toString(16).slice(2, 8)}`,
			eventTitle: "ChainBuilders Winter Hackathon",
			eventDate: "Dec 02",
			location: "Online",
		};
		setTicket(mock);
	}, [ticketId, address]);

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");
	const formatDate = (iso) => {
		try { return new Date(iso).toLocaleString(); } catch { return iso; }
	};

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
				<div className="container mx-auto max-w-3xl">
					<button
						type="button"
						onClick={() => navigate("/Dashboard")}
						className={`${btnPrimary} mb-6`}
					>Back to Dashboard</button>
					<h1
						className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
						style={{
							backgroundImage: "linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)",
						}}
					>
						Ticket Details
					</h1>
					<p className="text-gray-300/80 mt-2 text-sm sm:text-base max-w-md">Review your ticket information and status.</p>
					{ticket && (
						<p className="text-xs text-gray-400 mt-2">Ticket ID: {ticket.id}</p>
					)}
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-6">
				<div className="container mx-auto max-w-3xl space-y-6 h-full">
					{!ticket ? (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 text-center text-gray-400">Loading ticket...</div>
					) : (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<div>
										<div className="text-xs text-gray-300/60">Event</div>
										<div className="text-white font-medium">{ticket.eventTitle}</div>
										<div className="text-xs text-gray-300/60 mt-1">{ticket.eventDate} • {ticket.location}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Tier</div>
										<div className="text-white/90">{ticket.tierName}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Price Bought</div>
										<div className="text-white/90">{ticket.priceBought === 0 ? 'Free' : `${ticket.priceBought} $`}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Purchased At</div>
										<div className="text-white/90">{formatDate(ticket.purchasedAt)}</div>
									</div>
								</div>
								<div className="space-y-3">
									<div>
										<div className="text-xs text-gray-300/60">Wallet</div>
										<div className="text-white/90">{short(ticket.walletAddress)}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Event ID</div>
										<div className="text-white/90 break-all">{ticket.eventId}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Status</div>
										<div className={`text-sm font-medium ${ticket.status === 'valid' ? 'text-green-300' : ticket.status === 'used' ? 'text-yellow-300' : 'text-red-300'}`}>{ticket.status}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">QR Code Ref</div>
										<div className="text-white/90">{ticket.ticketQRCode}</div>
									</div>
								</div>
							</div>
							<div className="mt-6 flex flex-wrap gap-3">
								<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm" onClick={() => alert('Download QR (demo)')}>Download QR</button>
								<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm" onClick={() => alert('Regenerate QR (demo)')}>Regenerate QR</button>
								<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm" onClick={() => alert('Mark Used (demo)')}>Mark Used</button>
							</div>
							<p className="text-xs text-gray-400 mt-4">Actions are placeholders; integrate Firestore & verification flow later.</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
