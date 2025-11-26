import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { connector } from "../../api/axios";
import { useMessageModal } from "../../context/MessageModal";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function EventScanner() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const { id: eventId } = useParams();
	const { showMessage } = useMessageModal();
	const scannerRef = useRef(null);
	const html5QrcodeScannerRef = useRef(null);

	const [event, setEvent] = useState(null);
	const [scanning, setScanning] = useState(false);
	const [manualTicketId, setManualTicketId] = useState("");
	const [attendees, setAttendees] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!address) {
			navigate("/");
			return;
		}
		fetchEventDetails();
		fetchAttendees();
		
		// Cleanup scanner on unmount
		return () => {
			if (html5QrcodeScannerRef.current) {
				html5QrcodeScannerRef.current.clear().catch(err => console.error('Scanner cleanup error:', err));
			}
		};
	}, [address, eventId, navigate]);

	const fetchEventDetails = async () => {
		try {
			const response = await connector.get(`/events/listEvents`);
			if (response.status === 200) {
				const foundEvent = response.data.events.find(e => e.event_id === eventId);
				if (!foundEvent) {
					showMessage({
						title: 'Event Not Found',
						message: 'Could not find event details.',
						type: 'error',
						autoCloseMs: 3000,
					});
					navigate('/Dashboard');
					return;
				}
				// Check if user is the host
				if (foundEvent.host_address !== address) {
					showMessage({
						title: 'Access Denied',
						message: 'Only the event host can access the scanner.',
						type: 'error',
						autoCloseMs: 3000,
					});
					navigate('/Dashboard');
					return;
				}
				setEvent(foundEvent);
			}
		} catch (error) {
			console.error('Error fetching event:', error);
			showMessage({
				title: 'Error',
				message: 'Failed to load event details.',
				type: 'error',
				autoCloseMs: 3000,
			});
		}
	};

	const fetchAttendees = async () => {
		try {
			const response = await connector.get(`/events/attendees/${eventId}`);
			if (response.status === 200) {
				const foundTickets = response.data.attendees || [];
				setAttendees(foundTickets);
			}
		} catch (error) {
			console.error('Error fetching attendees:', error);
		}
	};

	const verifyTicket = async (ticketId) => {
		if (!ticketId || loading) return;
		setLoading(true);
		try {
			const response = await connector.post(`/events/verifyTicket`, {
				ticketId: ticketId.trim(),
				eventId,
				scannedBy: address,
			});

			if (response.status === 200) {
				showMessage({
					title: 'Ticket Verified',
					message: `Attendee checked in successfully.`,
					type: 'success',
					autoCloseMs: 2000,
				});
				fetchAttendees(); // Refresh attendee list
				setManualTicketId("");
			}
		} catch (error) {
			console.error('Verification error:', error);
			const errorMsg = error?.response?.data?.detail || 'Ticket verification failed.';
			showMessage({
				title: 'Verification Failed',
				message: errorMsg,
				type: 'error',
				autoCloseMs: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const startScanner = () => {
		if (!scannerRef.current || html5QrcodeScannerRef.current) return;
		
		const scanner = new Html5QrcodeScanner(
			"qr-reader",
			{ fps: 10, qrbox: { width: 250, height: 250 } },
			false
		);

		scanner.render(
			(decodedText) => {
				// Success callback
				if (decodedText) {
					scanner.clear();
					html5QrcodeScannerRef.current = null;
					setScanning(false);
					verifyTicket(decodedText);
				}
			},
			(error) => {
				// Error callback (silent, just scanning)
				console.debug('QR scan error:', error);
			}
		);

		html5QrcodeScannerRef.current = scanner;
		setScanning(true);
	};

	const stopScanner = () => {
		if (html5QrcodeScannerRef.current) {
			html5QrcodeScannerRef.current.clear().catch(err => console.error('Stop error:', err));
			html5QrcodeScannerRef.current = null;
		}
		setScanning(false);
	};

	const handleScan = (result, error) => {
		if (result) {
			const ticketId = result?.text;
			if (ticketId) {
				setScanning(false);
				verifyTicket(ticketId);
			}
		}
		if (error) {
			console.info('QR scan error:', error);
		}
	};

	const handleManualVerify = async (e) => {
		e.preventDefault();
		try{
			const response = await connector.post(`/events/verifyTicketById/${manualTicketId.trim()}/${eventId}`);
			if (response.status === 200) {
				showMessage({
					title: 'Ticket Verified',
					message: `Attendee checked in successfully.`,
					type: 'success',
					autoCloseMs: 2000,
				});
				fetchAttendees();
			}
		} catch (error) {
			console.error('Manual verification error:', error);
			showMessage({
				title: 'Verification Failed',
				message: error?.response?.data?.detail || 'Ticket verification failed.',
			});
		}
	};

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");
	const formatDate = (iso) => {
		try { return new Date(iso).toLocaleString(); } catch { return iso; }
	};

	return (
		<div className="relative min-h-screen flex flex-col">
			<div className="absolute inset-0 z-0">
				{[0, 1, 2, 3].map((i) => (
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

			<section className="relative z-10 pt-10 sm:pt-16 pb-6 sm:pb-10 px-4 sm:px-6">
				<div className="container mx-auto max-w-6xl">
					<button
						type="button"
						onClick={() => navigate("/Dashboard")}
						className={`${btnPrimary} mb-6`}
					>
						Back to Dashboard
					</button>
					<h1
						className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
						style={{
							backgroundImage: "linear-gradient(to bottom, #d9e1e7 0%, #f1f4f6 60%, #ffffff 100%)",
						}}
					>
						Event Scanner
					</h1>
					<p className="text-gray-300/80 mt-2 text-sm sm:text-base max-w-md">
						Scan attendee QR codes to log check-ins.
					</p>
					{event && (
						<div className="mt-2 text-xs text-gray-400">
							<p>Event: {event.event_title}</p>
							<p>Host: {short(event.hostAddress)}</p>
						</div>
					)}
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-10">
				<div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Scanner Panel */}
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">QR Scanner</h2>
						
						{scanning ? (
							<div className="space-y-4">
								<div id="qr-reader" ref={scannerRef} className="rounded-lg overflow-hidden"></div>
								<button
									onClick={stopScanner}
									className="w-full h-10 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm"
								>
									Stop Scanning
								</button>
							</div>
						) : (
							<button
								onClick={startScanner}
								className={`${btnPrimary} w-full mb-4`}
							>
								Start Camera Scanner
							</button>
						)}

						<div className="mt-6 pt-6 border-t border-white/5">
							<h3 className="text-white/90 font-medium mb-3">Manual Entry</h3>
							<form onSubmit={handleManualVerify} className="space-y-3">
								<input
									type="text"
									value={manualTicketId}
									onChange={(e) => setManualTicketId(e.target.value)}
									placeholder="Enter Ticket ID"
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
								<button
									type="submit"
									disabled={loading || !manualTicketId.trim()}
									className={`${btnPrimary} w-full ${(loading || !manualTicketId.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
								>
									{loading ? 'Verifying...' : 'Verify Ticket'}
								</button>
							</form>
						</div>
					</div>

					{/* Attendees List */}
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">
								Checked In ({attendees.filter(a => a.status === 'checkedIn').length})
							</h2>
							<button
								onClick={fetchAttendees}
								className="h-9 px-4 rounded-full border border-white/10 text-white/80 hover:bg-white/10 text-xs"
							>
								Refresh
							</button>
						</div>
						
						<div className="space-y-2 max-h-[600px] overflow-y-auto">
							{attendees.length === 0 ? (
								<div className="text-xs text-gray-400 text-center py-8">
									No attendees checked in yet.
								</div>
							) : (
								attendees.filter(a => a.status === 'checkedIn').map((attendee, idx) => ( 
									<div
										key={attendee.ticketId || idx}
										className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="text-white font-medium">
													{short(attendee.walletAddress)}
												</div>
												<div className="text-xs text-gray-300/70 mt-1">
													{attendee.tierName} • {attendee.ticketId?.slice(0, 8)}...
												</div>
												<div className="text-xs text-gray-400 mt-1">
													checked in at {formatDate(attendee.checkedInAt)}
												</div>
											</div>
											<div className="text-xs text-green-300">✓</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
