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
	const [hackRewards, setHackRewards] = useState("");
	const [ticketPrice, setTicketPrice] = useState("");
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
		const payload = {
			title: title.trim(),
			description: description.trim(),
			startDate,
			endDate: endDate || null,
			hackRewards: hackRewards !== "" ? Number(hackRewards) : null,
			ticketPrice: ticketPrice !== "" ? Number(ticketPrice) : null,
			creator: address,
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
			setHackRewards("");
			setTicketPrice("");
			navigate("/Dashboard");
		}, 600);
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
							className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent"
							style={{
								backgroundImage:
									"linear-gradient(to bottom, #B4AFA8 0%, #E5E5E5 56%, #E5E5E5 75%, #FFFFFF 100%)",
							}}
						>
							Create Event
						</h1>
						<p className="text-gray-300/70 mt-2 text-sm sm:text-base max-w-md">
							Launch a new hackathon, meetup, or workshop. Provide clear details so builders can engage.
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

						{/* Optional financials */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-300/80">$HACK Rewards (optional)</label>
								<input
									type="number"
									min="0"
									step="0.01"
									inputMode="decimal"
									placeholder="e.g. 500"
									value={hackRewards}
									onChange={(e) => setHackRewards(e.target.value)}
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
							</div>
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-300/80">Ticket Price (optional)</label>
								<input
									type="number"
									min="0"
									step="0.01"
									inputMode="decimal"
									placeholder="e.g. 0 or 10"
									value={ticketPrice}
									onChange={(e) => setTicketPrice(e.target.value)}
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
							</div>
						</div>

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

