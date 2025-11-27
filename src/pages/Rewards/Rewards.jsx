import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet, useReadContract, useWalletBalance } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { hackTokenContract } from "../../main";
import { balanceOf } from "thirdweb/extensions/erc20";
import { useState } from "react";
import { connector } from "../../api/axios";

export default function Rewards() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const { data: hackTokenBalance } = useReadContract(balanceOf,{
		contract: hackTokenContract,
		address: address,
	});
	const [claimable, setClaimable] = useState(0);
	const [tasks, setTasks] = useState([]);
	const [claimables, setClaimables] = useState(tasks.filter(t => t.claimed === false));

	const tokenBalance = hackTokenBalance ? Number(hackTokenBalance) / 10**18 : 0;
	
	

	useEffect(() => {
		retrieveTasks();
		if (!address) navigate("/");
		console.log("Amount of $HACK in wallet:", tokenBalance);
	}, [address, navigate]);

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

	const retrieveTasks = async() => {
		const response = await connector.get(`/users/retrieveTasks/${address}`);
		if(response.status === 200){
			console.log("Tasks data:", response.data.tasks);
			setClaimables(response.data.tasks);
			// Calculate claimable
			const claimableNow = response.data.tasks
				.filter(t => t.claimed === false)
				.reduce((sum, t) => sum + (t.amount || 0), 0);
			setClaimable(claimableNow);
		}
	}

	const history = [
		{ title: "Submission Bonus", amount: 40, time: "2d ago" },
		{ title: "Daily Streak", amount: 10, time: "3d ago" },
		{ title: "Feedback Given", amount: 15, time: "1w ago" },
	];

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
										"linear-gradient(to bottom, #d8e1e7 0%, #eff2f5 60%, #ffffff 100%)",
								}}
							>
								Rewards
							</h1>
							<p className="text-gray-300/80 mt-2 text-sm sm:text-base max-w-lg">
								Earn $HACK for building, sharing, and supporting others.
							</p>
							{address && (
								<p className="text-xs text-gray-400 mt-2">Signed in as {short(address)}</p>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Summary */}
			<section className="relative z-10 px-4 sm:px-6">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">$HACK Balance</div>
						<div className="text-4xl font-bold text-white mt-2">
							{hackTokenBalance ? tokenBalance.toFixed(2) : '0.00'}
						</div>
						<div className="text-xs text-gray-300/60 mt-2">Wallet Balance</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">Claimable Now</div>
						<div className="text-4xl font-bold text-white mt-2">{claimable}</div>
						<div className="text-xs text-gray-300/60 mt-2">{claimables.length} pending rewards</div>
					</div>
					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="text-sm text-gray-300/70">Rank</div>
						<div className="text-4xl font-bold text-white mt-2">#27</div>
						<div className="text-xs text-gray-300/60 mt-2">Top 5% this month</div>
					</div>
				</div>
			</section>

			{/* Claimable */}
			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10">
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					<div className="lg:col-span-2 rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl sm:text-2xl font-semibold text-white">Claimable Rewards</h2>
							<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => alert("Claim all (demo)")}>Claim all</button>
						</div>
						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							{claimables.map((r, i) => (
								<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4 hover:bg-white/5 transition">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-white font-medium">{r.title}</div>
											<div className="text-xs text-gray-300/70 mt-1">{r.desc}</div>
										</div>
										<div className="text-right">
											<div className="text-white font-semibold">{r.amount} $HACK</div>
											<button className="mt-2 h-9 px-4 rounded-full border border-white/10 text-white/90 hover:bg-white/10 text-sm" onClick={() => alert(`Claimed ${r.amount} $HACK (demo)`)}>Claim</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Redemption Options</h2>
						<div className="mt-4 grid grid-cols-1 gap-3">
							{[
								{ label: "Swap to Voucher", hint: "Coming soon" },
								{ label: "Mint Badge", hint: "Unlockable at 1,000 $HACK" },
								{ label: "Donate to Pool", hint: "Support community bounties" },
							].map((opt, i) => (
								<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-3 flex items-center justify-between">
									<div className="text-white/90">{opt.label}</div>
									<div className="text-xs text-gray-300/70">{opt.hint}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* History */}
			<section className="relative z-10 px-4 sm:px-6 mt-6 sm:mt-10 pb-10 sm:pb-16">
				<div className="container mx-auto rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl sm:text-2xl font-semibold text-white">Recent Activity</h2>
						<button className="text-sm text-gray-300/80 hover:text-white" onClick={() => navigate("/Dashboard")}>Back</button>
					</div>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
						{history.map((h, i) => (
							<div key={i} className="rounded-xl bg-white/0 border border-white/5 p-4">
								<div className="text-white font-medium">{h.title}</div>
								<div className="text-xs text-gray-300/70 mt-1">{h.time}</div>
								<div className="mt-3 text-white/90">+{h.amount} $HACK</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

