import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { useUser } from "../../context/UserContext";
import { connector } from "../../api/axios";


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
	const [activeTicket, setActiveTicket] = useState(null);
	const {tickets, addTickets} = useUser();

	const handleDownloadQr = async (ticket) => {
		if (!ticket.qrCodeUrl) {
			alert('QR code not available');
			return;
		}
		try {
			const response = await fetch(ticket.qrCodeUrl);
			const blob = await response.blob();
			const blobUrl = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = `ticket-${ticket.ticketId}.png`;
			link.click();

			window.URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Download failed:', error);
			alert('Failed to download QR code');
		}
	};


	useEffect(() => {
		if (!address) navigate("/");
	}, [address, navigate]);

	useEffect(() => {
		if (!ticketId || !address) return;
		const fetchTicket = async () => {
			try {
				const response = await connector.get(`/events/retrieveTickets/${address}`);
				if(response.status === 200){
					const ticket = response.data.tickets.find(t => t.ticketId === ticketId);
					console.log(`found ticket for id ${ticketId}:`, ticket);
					setActiveTicket(ticket);
				}
			} catch (error) {
				console.error("Error fetching ticket:", error);
			}
		};
		fetchTicket();
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
					{activeTicket && (
						<p className="text-xs text-gray-400 mt-2">Ticket ID: {activeTicket.ticketId}</p>
					)}
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-6">
				<div className="container mx-auto max-w-3xl space-y-6 h-full">
					{!activeTicket ? (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 text-center text-gray-400">Loading Ticket...</div>
					) : (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<div>
										<div className="text-xs text-gray-300/60">Event ID</div>
										<div className="text-white font-medium break-all">{activeTicket.eventId}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Tier</div>
										<div className="text-white/90">{activeTicket.tierName}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Price Bought</div>
										<div className="text-white/90">{activeTicket.priceBought === 0 ? 'Free' : `${activeTicket.priceBought} tokens`}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Purchased At</div>
										<div className="text-white/90">{formatDate(activeTicket.purchasedAt)}</div>
									</div>
								</div>
								<div className="space-y-3">
									<div>
										<div className="text-xs text-gray-300/60">Wallet</div>
										<div className="text-white/90">{short(activeTicket.walletAddress)}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Ticket ID</div>
										<div className="text-white/90 break-all text-xs">{activeTicket.ticketId}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Status</div>
										<div className={`text-sm font-medium ${activeTicket.status === 'valid' ? 'text-green-300' : activeTicket.status === 'used' ? 'text-yellow-300' : 'text-green-300'}`}>{activeTicket.status || 'active'}</div>
									</div>
									<div>
										<div className="text-xs text-gray-300/60">Signature</div>
										<div className="text-white/90 break-all text-xs">{activeTicket.signature?.slice(0, 16)}...</div>
									</div>
								</div>
							</div>
							{activeTicket.qrCodeUrl && (
								<div className="mt-6">
									<div className="text-xs text-gray-300/60 mb-2">QR Code</div>
									<div className="bg-white p-4 rounded-lg inline-block">
										<img src={activeTicket.qrCodeUrl} alt="Ticket QR Code" className="w-48 h-48" />
									</div>
								</div>
							)}
							<div className="mt-6 flex flex-wrap gap-3">
								<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm" onClick={() => handleDownloadQr(activeTicket)}>Download QR</button>
							</div>
							<p className="text-xs text-gray-400 mt-4">Show this QR code at the event for verification.</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
