import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";

export default function CreateProject() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [eventLink, setEventLink] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [status, setStatus] = useState("upcoming");
	const [ticketTiers, setTicketTiers] = useState([
		{ tierName: "General", price: "0", ticketCount: "100", hackRewards: "0" },
	]);
	const [submitting, setSubmitting] = useState(false);
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		if (!address) {
			navigate("/");
		}
	}, [address, navigate]);

	const valid = title.trim() && description.trim() && startDate;

	const handleSubmit = (e) => {
		e.preventDefault();
		setTouched(true);
		if (!valid) return;
		setSubmitting(true);
		const tierPayload = ticketTiers
			.filter(t => t.tierName.trim())
			.map(t => ({
				tierName: t.tierName.trim(),
				price: Number(t.price) || 0,
				ticketCount: Number(t.ticketCount) || 0,
				ticketsSold: 0,
				hackRewards: Number(t.hackRewards) || 0,
			}));
		const payload = {
			hostAddress: address,
			title: title.trim(),
			description: description.trim(),
			eventLink: eventLink.trim() || null,
			imageUrl: imageUrl.trim() || null,
			startDate: startDate,
			endDate: endDate || null,
			status,
			ticketTiers: tierPayload,
			createdAt: new Date().toISOString(),
		};
		console.log("[Event Create]", payload);
		// Placeholder: integrate with backend or smart contract here.
		setTimeout(() => {
			setSubmitting(false);
			setTitle("");
			setDescription("");
			setStartDate("");
			setEndDate("");
			setEventLink("");
			setImageUrl("");
			setStatus("upcoming");
			setTicketTiers([{ tierName: "General", price: "0", ticketCount: "100", hackRewards: "0" }]);
			navigate("/Dashboard");
		}, 600);
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
								<label className="block text-sm font-medium text-gray-300/80">Image URL (optional)</label>
								<input
									type="url"
									placeholder="https://images.host/banner.png"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
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
								<h3 className="text-white/90 font-medium text-sm">Ticket Tiers (optional)</h3>
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
												placeholder="Price"
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
											<input
												type="number"
												min="0"
												value={tier.hackRewards}
												placeholder="$HACK"
												onChange={e => updateTier(i,'hackRewards', e.target.value)}
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
								disabled={!valid || submitting}
								className={`${btnPrimary} ${(!valid || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								{submitting ? 'Creating...' : 'Create Event'}
							</button>
						</div>
					</form>
				</div>
				</div>
			</section>
		</div>
	);
}

