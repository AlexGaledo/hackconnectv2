import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { connector } from "../../api/axios";
import { useMessageModal } from "../../context/MessageModal";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useSearchParams } from "react-router-dom";


export default function EventScanner() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const [searchParams] = useSearchParams();
	const eventId = searchParams.get("id") || "EVT-1"; // fallback mock id
	const { showMessage } = useMessageModal();
	const scannerRef = useRef(null);
	const html5QrcodeScannerRef = useRef(null);

	const [event, setEvent] = useState(null);
	const [scanning, setScanning] = useState(false);
	const [manualTicketId, setManualTicketId] = useState("");
	const [attendees, setAttendees] = useState([]);
	const [loading, setLoading] = useState(false);
	const [uploadMode, setUploadMode] = useState(false);

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

	const verifyTicket = async (ticketData) => {
		if (!ticketData || loading) return;
		
		// Stop scanner first
		if (html5QrcodeScannerRef.current) {
			await html5QrcodeScannerRef.current.clear().catch(err => console.error('Clear error:', err));
			html5QrcodeScannerRef.current = null;
			setScanning(false);
		}
		
		setLoading(true);
		try {
			// Parse QR code data if it's JSON
			let ticketInfo;
			try {
				ticketInfo = typeof ticketData === 'string' ? JSON.parse(ticketData) : ticketData;
			} catch (e) {
				// If not JSON, treat as plain ticket ID
				ticketInfo = { signature: ticketData.trim() };
			}

			// Extract signature (ticket ID) and wallet address
			const ticketId = ticketInfo.ticketId || null;
			const ticketSignature = ticketInfo.signature || null;
			const walletAddress = ticketInfo.walletAddress || null;

			const response = await connector.post(`/events/verifyTicket/${eventId}`,{
				qr_data: ticketInfo
			} );
			if (response.status === 200) {
				showMessage({
					title: 'Ticket Verified',
					message: `Attendee ${walletAddress ? walletAddress.slice(0, 6) + '...' : ''} checked in successfully.`,
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
		if (html5QrcodeScannerRef.current) {
			console.log('Scanner already running');
			return;
		}
		
		setScanning(true);
		
		// Small delay to ensure DOM is ready
		setTimeout(() => {
			try {
				const scanner = new Html5QrcodeScanner(
					"qr-reader",
					{ 
						fps: 5, // Reduced FPS for better accuracy
						qrbox: 300, // Larger box for easier targeting
						aspectRatio: 1.0,
						showTorchButtonIfSupported: true,
						formatsToSupport: [0], // Only QR codes (0 = QR_CODE)
						experimentalFeatures: {
							useBarCodeDetectorIfSupported: true
						},
						rememberLastUsedCamera: true,
						videoConstraints: {
							facingMode: "environment", // Use back camera on mobile
							width: { ideal: 1280 },
							height: { ideal: 720 }
						},
						disableFlip: false // Try both orientations
					},
					false
				);

				scanner.render(
					(decodedText) => {
						// Success callback
						console.log('QR Code detected:', decodedText);
						if (decodedText) {
							verifyTicket(decodedText);
						}
					},
					(error) => {
						// Error callback (silent, just scanning)
						// This fires on every frame, don't log unless it's a critical error
						if (error && !error.includes('NotFoundException')) {
							console.warn('Scanner error:', error);
						}
					}
				);

				html5QrcodeScannerRef.current = scanner;
			} catch (error) {
				console.error('Scanner initialization error:', error);
				setScanning(false);
				showMessage({
					title: 'Scanner Error',
					message: 'Failed to start camera. Please check permissions.',
					type: 'error',
					autoCloseMs: 3000,
				});
			}
		}, 100);
	};

	const stopScanner = () => {
		if (html5QrcodeScannerRef.current) {
			html5QrcodeScannerRef.current.clear()
				.then(() => {
					console.log('Scanner cleared successfully');
					html5QrcodeScannerRef.current = null;
					setScanning(false);
				})
				.catch(err => {
					console.error('Stop error:', err);
					html5QrcodeScannerRef.current = null;
					setScanning(false);
				});
		} else {
			setScanning(false);
		}
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setLoading(true);
		try {
			// Use html5-qrcode's file scanning directly
			const { Html5Qrcode } = await import('html5-qrcode');
			const html5QrCode = new Html5Qrcode("temp-qr-reader");
			
			const result = await html5QrCode.scanFile(file, true);
			console.log('QR decoded from file:', result);
			
			if (result) {
				await verifyTicket(result);
			}
		} catch (error) {
			console.error('File scan error:', error);
			showMessage({
				title: 'Scan Failed',
				message: 'Could not read QR code from image. Try manual entry instead.',
				type: 'error',
				autoCloseMs: 3000,
			});
		} finally {
			setLoading(false);
			// Reset file input
			e.target.value = '';
		}
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
		if (!manualTicketId.trim()) return;
		
		setLoading(true);
		try {
			// Try to parse as JSON first
			let ticketInfo;
			try {
				ticketInfo = JSON.parse(manualTicketId.trim());
				// If it's JSON, use the full verifyTicket flow
				await verifyTicket(manualTicketId.trim());
				setManualTicketId("");
				return;
			} catch (e) {
				// Not JSON, treat as plain ticket ID
				ticketInfo = { ticketId: manualTicketId.trim() };
			}

			// Plain ticket ID - use the old endpoint
			const response = await connector.post(`/events/verifyTicketById/${manualTicketId.trim()}/${eventId}`);
			if (response.status === 200) {
				showMessage({
					title: 'Ticket Verified',
					message: `Attendee checked in successfully.`,
					type: 'success',
					autoCloseMs: 2000,
				});
				fetchAttendees();
				setManualTicketId("");
			}
		} catch (error) {
			console.error('Manual verification error:', error);
			showMessage({
				title: 'Verification Failed',
				message: error?.response?.data?.detail || 'Ticket verification failed.',
				type: 'error',
				autoCloseMs: 3000,
			});
		} finally {
			setLoading(false);
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
						
						<div id="temp-qr-reader" style={{ display: 'none' }}></div>
						
						{scanning ? (
							<div className="space-y-4">
								<div id="qr-reader" className="rounded-lg overflow-hidden w-full min-h-[300px]"></div>
								<button
									onClick={stopScanner}
									className="w-full h-10 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm"
								>
									Stop Scanning
								</button>
								<p className="text-xs text-gray-400 mt-2">
									Allow camera permissions when prompted. Point your camera at the QR code on the ticket.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								<button
									onClick={startScanner}
									className={`${btnPrimary} w-full`}
								>
									Start Camera Scanner
								</button>
								<div className="relative">
									<input
										type="file"
										accept="image/*"
										onChange={handleFileUpload}
										className="hidden"
										id="qr-file-upload"
										disabled={loading}
									/>
									<label
										htmlFor="qr-file-upload"
										className={`${btnPrimary} w-full cursor-pointer text-center block ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
									>
										{loading ? 'Processing...' : 'Upload QR Image'}
									</label>
								</div>
								<p className="text-xs text-gray-400">
									Use camera for live scanning or upload a QR code image file.
								</p>
							</div>
						)}

						<div className="mt-6 pt-6 border-t border-white/5">
							<h3 className="text-white/90 font-medium mb-3">Manual Entry</h3>
							<p className="text-xs text-gray-400 mb-3">
								If camera scanning doesn't work, paste the full JSON from the QR code or just the ticket ID below:
							</p>
							<form onSubmit={handleManualVerify} className="space-y-3">
								<textarea
									value={manualTicketId}
									onChange={(e) => setManualTicketId(e.target.value)}
									placeholder='Paste ticket ID or full QR JSON (e.g., {"eventTitle": "...", "ticketId": "...", ...})'
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm min-h-[80px]"
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
