import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { connector } from "../../api/axios";
import { hackTokenContract } from "../../main";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { useMessageModal } from "../../context/MessageModal";



export default function CreateProject() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	// Move transaction hook to top-level to comply with React rules
	const { mutate: sendTransaction, isPending: burning } = useSendTransaction();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [eventLink, setEventLink] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [status, setStatus] = useState("upcoming");
	const [ticketTiers, setTicketTiers] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [touched, setTouched] = useState(false);
	useEffect(() => {
		if (!address) {
			navigate("/");
		}
	}, [address, navigate]);

	const { showMessage } = useMessageModal();

	const valid = title.trim() && description.trim() && startDate;

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				showMessage({
					title: 'File Too Large',
					message: 'Image must be less than 5MB',
					type: 'warning',
					autoCloseMs: 3000,
				});
				return;
			}
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const clearImage = () => {
		setImageFile(null);
		setImagePreview("");
	};



	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched(true);
		if (!valid || submitting || burning) return;
		setSubmitting(true);
		try {
			const tierPayload = ticketTiers
				.filter(t => t.tierName.trim())
				.map(t => ({
						tierName: t.tierName.trim(),
						price: Number(t.price) || 0,
						ticketCount: Number(t.ticketCount) || 0,
						ticketsSold: 0,
				}));
			
			// Build FormData for the backend
			const formData = new FormData();
			formData.append('host_address', address);
			formData.append('title', title.trim());
			formData.append('description', description.trim());
			if (eventLink.trim()) formData.append('event_link', eventLink.trim());
			formData.append('date_start', startDate);
			if (endDate) formData.append('date_end', endDate);
			formData.append('status', status);
			formData.append('ticket_tiers', JSON.stringify(tierPayload));
			if (imageFile) formData.append('image', imageFile);

			console.log("Create event FormData fields:", {
				host_address: address,
				title: title.trim(),
				description: description.trim(),
				event_link: eventLink.trim() || null,
				date_start: startDate,
				date_end: endDate || null,
				status,
				ticket_tiers: tierPayload,
				image: imageFile?.name || null
			});

			// Burn tokens (scale to 18 decimals)
			const tokensToBurn = 0n;
			const amount = tokensToBurn * 10n ** 18n;

			const response = await connector.post(`/events/create`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			console.log("Create event response:", response.data);
			if (response.status >= 200 && response.status < 300) {
				const transaction = prepareContractCall({
					contract: hackTokenContract,
					method: "function burn(uint256 value)",
					params: [amount],
				});
				sendTransaction(transaction, {
					onSuccess: () => {
						showMessage({
							title: 'Event Created',
							message: `Event created and ${tokensToBurn.toString()} HACK burned successfully.`,
							type: 'success',
							autoCloseMs: 3000,
						});
						navigate("/Events");
					},
					onError: (error) => {
						console.error('Burn failed:', error);
						showMessage({
							title: 'Event Created',
							message: 'Event created. Burn failed — you can retry later.',
							type: 'warning',
							autoCloseMs: 3000,
						});
						navigate("/Events");
					}
				});
			}
		} catch (err) {
			console.error('Create event failed:', err);
			console.error('Error response:', err?.response);
			console.error('Error message:', err?.message);
			
			// Extract error message from FastAPI validation errors
			let errorMsg = 'Unable to create event. Check console for details.';
			if (err?.response?.data?.detail) {
				if (Array.isArray(err.response.data.detail)) {
					// FastAPI validation errors
					errorMsg = err.response.data.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('; ');
				} else if (typeof err.response.data.detail === 'string') {
					errorMsg = err.response.data.detail;
				}
			} else if (err?.message) {
				errorMsg = err.message;
			}
			
			showMessage({
				title: 'Event Creation Failed',
				message: errorMsg,
				type: 'error',
				autoCloseMs: 5000,
			});
		} finally {
			setSubmitting(false);
		}
	};

	const updateTier = (index, field, value) => {
		setTicketTiers(prev => prev.map((t,i) => i === index ? { ...t, [field]: value } : t));
	};

	const addTier = () => {
		setTicketTiers(prev => [...prev, { tierName: "", price: "0", ticketCount: "0", hackRewards: "0" }]);
	};

	const removeTier = (index) => {
		setTicketTiers(prev => prev.filter((_,i) => i !== index));
	};

	return (
	<div className="relative">
		{/* Background rectangles (soft) */}
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
			<div className="container mx-auto max-w-4xl">
				<div className="mb-8">
						<button
							type="button"
							onClick={() => navigate("/Dashboard")}
							className={`${btnPrimary} z-40 mx-0 mr-0 -top-6 right-6 sm:right-8 mb-4`}
						>
							Back to Dashboard
						</button>
					<h1
						className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
						style={{
							backgroundImage:
								"linear-gradient(to bottom, #d9e1e7 0%, #f1f4f6 60%, #ffffff 100%)",
						}}
					>
						Create Event
					</h1>
					<p className="text-gray-300/80 mt-2 text-sm sm:text-base max-w-md">
						Launch a hackathon or meetup. Share the essentials; keep it crisp.
					</p>
				</div>

				<div className="relative mb-4">
					
					<form
						onSubmit={handleSubmit}
						className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 sm:p-8 space-y-6"
					>
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300/80">
							Event Title <span className="text-gray-400">*</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. ChainBuilders Winter Hackathon"
							className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
						/>
						{touched && !title.trim() && (
							<p className="text-xs text-red-400">Title is required.</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300/80">
							Event Description <span className="text-gray-400">*</span>
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Brief overview, goals, prize details, themes..."
							rows={6}
							className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm resize-y"
						/>
						<div className="flex justify-between text-xs text-gray-400">
							<span>{description.length}/800</span>
							<span>Keep it clear & concise.</span>
						</div>
						{touched && !description.trim() && (
							<p className="text-xs text-red-400">Description is required.</p>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">
								Start Date <span className="text-gray-400">*</span>
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white text-sm"
							/>
							{touched && !startDate && (
								<p className="text-xs text-red-400">Start date required.</p>
							)}
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">End Date (optional)</label>
							<input
								type="date"
								value={endDate}
								min={startDate || undefined}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white text-sm"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">Event Link (optional)</label>
							<input
								type="url"
								placeholder="https://example.com/hackathon"
								value={eventLink}
								onChange={(e) => setEventLink(e.target.value)}
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">Event Image (optional)</label>
							<div className="relative">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									id="image-upload"
								/>
								<label
									htmlFor="image-upload"
									className="flex items-center justify-center w-full rounded-xl bg-white/0 border border-white/5 hover:border-white/20 focus:border-white/30 px-4 py-3 text-white/70 hover:text-white text-sm cursor-pointer transition"
								>
									{imageFile ? imageFile.name : '📁 Choose image (max 5MB)'}
								</label>
							</div>
							{imagePreview && (
								<div className="relative mt-2 rounded-lg overflow-hidden border border-white/10">
									<img src={imagePreview} alt="Preview" className="w-full h-24 object-cover" />
									<button
										type="button"
										onClick={clearImage}
										className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
									>
										✕
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300/80">Status</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white text-sm"
						>
							{["upcoming","ongoing","completed","postponed"].map(s => <option key={s} value={s}>{s}</option>)}
						</select>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-white/90 font-medium text-sm">Ticket Tiers</h3>
							<button type="button" onClick={addTier} className="h-9 px-4 rounded-full border border-white/10 text-white/80 hover:bg-white/10 text-xs">Add Tier</button>
						</div>
						<div className="space-y-3">
							{ticketTiers.map((tier, i) => {
								const hasName = tier.tierName.trim();
								return (
									<div key={i} className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-3 rounded-xl border border-white/5 bg-white/0">
										<input
											type="text"
											placeholder="Tier name"
											value={tier.tierName}
											onChange={e => updateTier(i,'tierName', e.target.value)}
											className="rounded-lg bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-3 py-2 text-white text-xs sm:text-sm col-span-2 sm:col-span-2"
										/>
										<input
											type="number"
											min="0"
											value={tier.price}
											placeholder="Price $Hack Tokens"
											onChange={e => updateTier(i,'price', e.target.value)}
											className="rounded-lg bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-3 py-2 text-white text-xs sm:text-sm col-span-1"
										/>
										<input
											type="number"
											min="0"
											value={tier.ticketCount}
											placeholder="Count"
											onChange={e => updateTier(i,'ticketCount', e.target.value)}
											className="rounded-lg bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-3 py-2 text-white text-xs sm:text-sm col-span-1"
										/>
										{ticketTiers.length > 1 && (
											<button type="button" onClick={() => removeTier(i)} className="text-xs text-gray-400 hover:text-red-300 col-span-2 sm:col-span-1 text-left sm:text-right">Remove</button>
										)}
									</div>
								);
							})}
						</div>
						{ticketTiers.some(t => t.tierName.trim() && (!t.price || !t.ticketCount)) && (
							<p className="text-xs text-red-400">Provide price and count for named tiers.</p>
						)}
					</div>

					{/* Ticket tiers replace old single price/rewards inputs */}

					<div className="pt-2">
						<button
							type="submit"
							disabled={!valid || submitting || burning}
							className={`${btnPrimary} ${(!valid || submitting || burning) ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{burning ? 'Awaiting Wallet…' : submitting ? 'Creating…' : 'Create Event'}
						</button>
					</div>
				</form>
			</div>
			</div>
		</section>
	</div>
	);
}
