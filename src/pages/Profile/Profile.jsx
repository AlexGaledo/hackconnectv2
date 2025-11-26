import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { btnPrimary } from "../../styles/reusables";
import { useUser } from "../../context/UserContext";
import { connector } from "../../api/axios";
import { useMessageModal } from "../../context/MessageModal";

export default function Profile() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address;
	const { user, addUser } = useUser();
	const { showMessage } = useMessageModal();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [age, setAge] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!address) {
			navigate("/");
			return;
		}
		// Load user data
		if (user) {
			setUsername(user.username || "");
			setEmail(user.email || "");
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setAge(user.age?.toString() || "");
		}
	}, [address, navigate, user]);

	const handleSave = async (e) => {
		e.preventDefault();
		if (!address) return;
		
		setLoading(true);
		try {
			const payload = {
				walletAddress: address,
				username: username.trim(),
				email: email.trim(),
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				age: age ? Number(age) : null,
			};

			const response = await connector.post(`/users/updateProfile`, payload);
			
			if (response.status === 200) {
				addUser(response.data);
				showMessage({
					title: 'Profile Updated',
					message: 'Your profile has been updated successfully.',
					type: 'success',
					autoCloseMs: 3000,
				});
			}
		} catch (error) {
			console.error('Profile update error:', error);
			showMessage({
				title: 'Update Failed',
				message: error?.response?.data?.detail || 'Failed to update profile.',
				type: 'error',
				autoCloseMs: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

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
				<div className="container mx-auto max-w-2xl">
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
						Profile Settings
					</h1>
					<p className="text-gray-300/80 mt-2 text-sm sm:text-base max-w-md">
						Manage your account information.
					</p>
					<p className="text-xs text-gray-400 mt-2">Connected: {short(address)}</p>
				</div>
			</section>

			<section className="relative z-10 px-4 sm:px-6 flex-1 pb-10">
				<div className="container mx-auto max-w-2xl">
					<form
						onSubmit={handleSave}
						className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6 sm:p-8 space-y-6"
					>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Choose a username"
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your.email@example.com"
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-300/80">
									First Name
								</label>
								<input
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									placeholder="First name"
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
							</div>
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-300/80">
									Last Name
								</label>
								<input
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									placeholder="Last name"
									className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-300/80">
								Age
							</label>
							<input
								type="number"
								value={age}
								onChange={(e) => setAge(e.target.value)}
								placeholder="Your age"
								min="13"
								max="120"
								className="w-full rounded-xl bg-white/0 border border-white/5 focus:border-white/30 focus:outline-none px-4 py-3 text-white placeholder-gray-500 text-sm"
							/>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								disabled={loading}
								className={`${btnPrimary} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
							>
								{loading ? 'Verifying...' : 'Verify now'}
							</button>
                            
						</div>
					</form>
				</div>
			</section>
		</div>
	);
}
