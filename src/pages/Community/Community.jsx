import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { useEffect } from "react";

export default function Community() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");
	useEffect(() => {
		if (!address) {
			navigate("/");
		}
	}, [address, navigate]);


	return (
		<div className="relative">
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
                    <button
							type="button"
							onClick={() => navigate("/Dashboard")}
							className={`${btnPrimary} z-40 mx-0 mr-0 -top-6 right-6 sm:right-8 mb-4`}
						>
							Back to Dashboard
						</button>
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
						<div>
							<h1
									className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
									style={{
										backgroundImage:
											"linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)",
									}}
								>
									Community
								</h1>
							<p className="text-gray-300/70 mt-2 text-sm sm:text-base max-w-xl">
								Connect with builders, share progress, and find collaborators.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">Members</div>
						<div className="text-4xl font-bold text-white mt-2">1,284</div>
						<div className="text-xs text-gray-300/60 mt-2">+38 this week</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">Active Today</div>
						<div className="text-4xl font-bold text-white mt-2">146</div>
						<div className="text-xs text-gray-300/60 mt-2">Peak at 2:10 PM</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">Projects Shared</div>
						<div className="text-4xl font-bold text-white mt-2">87</div>
						<div className="text-xs text-gray-300/60 mt-2">12 in the last 7 days</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10">
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					<div className="lg:col-span-2 rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">Recent Discussions</h2>
							<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/Dashboard")}>View all</button>
						</div>
						<div className="mt-4 space-y-3">
							{[
								{ title: "Looking for teammates for AI track", author: "0xA1...c93", replies: 12, time: "2h" },
								{ title: "Share your best dev tool", author: "0xF2...7bd", replies: 7, time: "5h" },
								{ title: "Feedback on NFT ticketing MVP", author: "0x3E...e12", replies: 19, time: "1d" },
							].map((p, i) => (
								<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-center justify-between gap-3">
										<div className="min-w-0">
											<div className="text-white font-medium truncate">{p.title}</div>
											<div className="text-xs text-gray-300/70 mt-1">By {p.author} • {p.replies} replies • {p.time} ago</div>
										</div>
										<button className="h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm">Open</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Channels</h2>
						<div className="mt-4 grid grid-cols-1 gap-3">
							{["#general", "#announcements", "#team-up", "#showcase"].map((c, i) => (
								<button key={i} className="w-full text-left rounded-xl bg-white/0 border border-white/5 p-3 text-white/90 hover:bg-white/5 transition">
									{c}
								</button>
							))}
						</div>
						<div className="mt-6">
							{address ? (
								<div className="text-xs text-gray-300/70">Signed in as <span className="text-white/90 font-medium">{short(address)}</span></div>
							) : (
								<div className="text-xs text-gray-300/70">Connect your wallet to post and reply.</div>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10 pb-10 sm:pb-16">
				<div className="container mx-auto rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Featured Builders</h2>
						<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/Dashboard")}>View all</button>
					</div>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						{["0x12...9aF", "0x7b...3E2", "0xC4...Dd1"].map((name, i) => (
							<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
								<div className="text-white font-medium">{name}</div>
								<div className="text-xs text-gray-300/70 mt-1">Contributor • 5 projects</div>
								<button className="mt-4 h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm w-fit">Profile</button>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

