import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveWallet } from "thirdweb/react";
import { connector } from "../../api/axios";
import { useMessageModal } from "../../context/MessageModal";

export default function Forum() {
	const navigate = useNavigate();
	const activeWallet = useActiveWallet();
	const address = activeWallet?.getAccount()?.address ?? null;
	const { showMessage } = useMessageModal();

	const [posts, setPosts] = useState([
		{
			postId: "1",
			authorAddress: "0x1234567890abcdef1234567890abcdef12345678",
			title: "Welcome to HackConnect Forum! 🎉",
			content: "Hey everyone! This is the official HackConnect community forum. Share your projects, ask questions, collaborate with fellow hackers, and stay updated with the latest in web3 innovation. Let's build the future together!",
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
			likes: ["0xabcdef1234567890abcdef1234567890abcdef12"],
			likesCount: 15,
			comments: [
				{
					authorAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
					content: "Excited to be here! Looking forward to connecting with other builders.",
					createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
				},
				{
					authorAddress: "0x9876543210fedcba9876543210fedcba98765432",
					content: "This platform is amazing! Already learned so much from the community.",
					createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
				}
			],
			commentsCount: 2,
		},
		{
			postId: "2",
			authorAddress: "0xfedcba9876543210fedcba9876543210fedcba98",
			title: "Just finished my first hackathon project! 🚀",
			content: "I built a decentralized voting system using smart contracts. It was challenging but incredibly rewarding. The HackConnect platform made it easy to manage everything from registration to submission. Huge thanks to the team!",
			createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
			likes: ["0x1234567890abcdef1234567890abcdef12345678", "0xabcdef1234567890abcdef1234567890abcdef12"],
			likesCount: 23,
			comments: [
				{
					authorAddress: "0x1234567890abcdef1234567890abcdef12345678",
					content: "That's awesome! Would love to see a demo. Did you use any specific framework?",
					createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
				}
			],
			commentsCount: 1,
		},
		{
			postId: "3",
			authorAddress: "0x9876543210fedcba9876543210fedcba98765432",
			title: "Looking for team members for upcoming hackathon",
			content: "I'm planning to build an NFT marketplace with advanced features. Looking for 2-3 developers with experience in Solidity and React. DM me if interested! Event starts next week.",
			createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
			likes: [],
			likesCount: 8,
			comments: [],
			commentsCount: 0,
		},
	]);
	const [newPostContent, setNewPostContent] = useState("");
	const [isCreatingPost, setIsCreatingPost] = useState(false);
	const [commentInputs, setCommentInputs] = useState({});
	const [expandedPosts, setExpandedPosts] = useState({});

	const retrievePosts = async () => {
		try {
			const response = await connector.get("/forum/listPosts");
			console.log("Forum posts:", response.data);
			if (response.status === 200 && response.data.posts) {
				setPosts(response.data.posts);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
			// Keep placeholder posts if backend fails
		}
	};

	useEffect(() => {
		if (!address) {
			navigate("/");
			return;
		}
		// Optionally fetch from backend
		// retrievePosts();
	}, [address, navigate]);

	const handleCreatePost = async (e) => {
		e.preventDefault();
		if (!newPostContent.trim()) {
			showMessage("Please write something", "error");
			return;
		}

		// Create new post locally (replace with backend call)
		const newPost = {
			postId: `post-${Date.now()}`,
			authorAddress: address,
			title: "", // No title for news feed style
			content: newPostContent,
			createdAt: new Date().toISOString(),
			likes: [],
			likesCount: 0,
			comments: [],
			commentsCount: 0,
		};

		setPosts([newPost, ...posts]);
		setNewPostContent("");
		setIsCreatingPost(false);
		showMessage("Post created!", "success");

		// Optionally sync with backend
		// try {
		// 	const response = await connector.post("/forum/createPost", {
		// 		walletAddress: address,
		// 		content: newPostContent,
		// 	});
		// 	if (response.status === 200 || response.status === 201) {
		// 		retrievePosts();
		// 	}
		// } catch (error) {
		// 	console.error("Error creating post:", error);
		// }
	};

	const handleLikePost = async (postId) => {
		// Update locally
		setPosts(posts.map(post => {
			if (post.postId === postId) {
				const hasLiked = post.likes?.includes(address);
				return {
					...post,
					likes: hasLiked 
						? post.likes.filter(addr => addr !== address)
						: [...(post.likes || []), address],
					likesCount: hasLiked ? post.likesCount - 1 : post.likesCount + 1,
				};
			}
			return post;
		}));

		// Optionally sync with backend
		// try {
		// 	await connector.post(`/forum/likePost/${postId}`, {
		// 		walletAddress: address,
		// 	});
		// } catch (error) {
		// 	console.error("Error liking post:", error);
		// }
	};

	const handleCommentOnPost = async (postId) => {
		const commentContent = commentInputs[postId];
		if (!commentContent?.trim()) {
			showMessage("Please enter a comment", "error");
			return;
		}

		// Add comment locally
		const newComment = {
			authorAddress: address,
			content: commentContent,
			createdAt: new Date().toISOString(),
		};

		setPosts(posts.map(post => {
			if (post.postId === postId) {
				return {
					...post,
					comments: [...(post.comments || []), newComment],
					commentsCount: post.commentsCount + 1,
				};
			}
			return post;
		}));

		setCommentInputs({ ...commentInputs, [postId]: "" });
		showMessage("Comment added!", "success");

		// Optionally sync with backend
		// try {
		// 	await connector.post(`/forum/commentPost/${postId}`, {
		// 		walletAddress: address,
		// 		content: commentContent,
		// 	});
		// } catch (error) {
		// 	console.error("Error commenting:", error);
		// }
	};

	const toggleComments = (postId) => {
		setExpandedPosts({
			...expandedPosts,
			[postId]: !expandedPosts[postId],
		});
	};

	const short = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

	const formatTimestamp = (timestamp) => {
		if (!timestamp) return "";
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	};

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
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
						<div>
							<h1
								className="text-4xl sm:text-5xl md:text-5xl font-semibold bg-clip-text text-transparent"
								style={{
									backgroundImage:
										"linear-gradient(to bottom, #d7dee4 0%, #eef1f4 60%, #ffffff 100%)",
								}}
							>
								Community Feed
							</h1>
							<p className="text-gray-300/70 mt-2 text-sm sm:text-base">
								Share updates, connect with builders, and stay inspired.
							</p>
						</div>
						<button
							onClick={() => setIsCreatingPost(!isCreatingPost)}
							className="h-10 px-6 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] text-white transition text-sm"
						>
							{isCreatingPost ? "Cancel" : "✨ Share Something"}
						</button>
					</div>
				</div>
			</section>

			{/* Create Post Form */}
			{isCreatingPost && (
				<section className="relative z-10 px-4 sm:px-6">
					<div className="container mx-auto">
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-6">
							<div className="flex items-start gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
									<span className="text-white text-sm font-semibold">{short(address).slice(0, 4)}</span>
								</div>
								<form onSubmit={handleCreatePost} className="flex-1 space-y-3">
									<textarea
										placeholder="What's happening in your build?"
										value={newPostContent}
										onChange={(e) => setNewPostContent(e.target.value)}
										rows={3}
										className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition resize-none text-sm"
										autoFocus
									/>
									<div className="flex justify-end gap-2">
										<button
											type="button"
											onClick={() => {
												setIsCreatingPost(false);
												setNewPostContent("");
											}}
											className="h-9 px-4 rounded-full border border-white/10 text-white/80 hover:bg-white/5 transition text-sm"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="h-9 px-5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] text-white transition text-sm"
										>
											Post
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Posts List */}
			<section className="relative z-10 px-4 sm:px-6 mt-6 pb-10 sm:pb-16">
				<div className="container mx-auto max-w-2xl space-y-4">
					{posts.length === 0 ? (
						<div className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-12 text-center">
							<p className="text-gray-400 text-sm">No posts yet. Be the first to share something!</p>
						</div>
					) : (
						posts.map((post) => (
							<div
								key={post.postId}
								className="rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-5 hover:bg-white/[0.02] transition"
							>
								{/* Post Header */}
								<div className="flex items-start gap-3 mb-3">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
										<span className="text-white text-sm font-semibold">{short(post.authorAddress).slice(0, 4)}</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-white font-medium text-sm">{short(post.authorAddress)}</span>
											<span className="text-gray-500 text-xs">•</span>
											<span className="text-gray-400 text-xs">{formatTimestamp(post.createdAt)}</span>
										</div>
										{post.title && <h3 className="text-base font-semibold text-white mt-1">{post.title}</h3>}
									</div>
								</div>

								{/* Post Content */}
								<p className="text-gray-300 text-sm mb-4 leading-relaxed pl-[52px]">{post.content}</p>

								{/* Post Actions */}
								<div className="flex items-center gap-6 pt-3 border-t border-white/5 pl-[52px]">
									<button
										onClick={() => handleLikePost(post.postId)}
										className={`flex items-center gap-2 text-sm transition ${
											post.likes?.includes(address)
												? "text-red-400"
												: "text-gray-400 hover:text-red-400"
										}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill={post.likes?.includes(address) ? "currentColor" : "none"}
											stroke="currentColor"
											className="w-5 h-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
											/>
										</svg>
										<span className="font-medium">{post.likesCount || 0}</span>
									</button>
									<button
										onClick={() => toggleComments(post.postId)}
										className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
											/>
										</svg>
										<span className="font-medium">{post.commentsCount || 0}</span>
									</button>
								</div>

								{/* Comments Section */}
								{expandedPosts[post.postId] && (
									<div className="mt-4 pt-4 border-t border-white/5 pl-[52px] space-y-3">
										{/* Comment Input */}
										<div className="flex items-start gap-2">
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
												<span className="text-white text-xs font-semibold">{short(address).slice(0, 3)}</span>
											</div>
											<div className="flex-1 flex gap-2">
												<input
													type="text"
													placeholder="Write a comment..."
													value={commentInputs[post.postId] || ""}
													onChange={(e) =>
														setCommentInputs({
															...commentInputs,
															[post.postId]: e.target.value,
														})
													}
													onKeyPress={(e) => {
														if (e.key === "Enter" && !e.shiftKey) {
															e.preventDefault();
															handleCommentOnPost(post.postId);
														}
													}}
													className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
												/>
												<button
													onClick={() => handleCommentOnPost(post.postId)}
													className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] text-white text-sm transition"
												>
													Post
												</button>
											</div>
										</div>

										{/* Comments List */}
										{post.comments && post.comments.length > 0 && (
											<div className="space-y-3 mt-3">
												{post.comments.map((comment, idx) => (
													<div key={idx} className="flex items-start gap-2">
														<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
															<span className="text-white text-xs font-semibold">{short(comment.authorAddress).slice(0, 3)}</span>
														</div>
														<div className="flex-1 rounded-lg bg-white/[0.03] border border-white/5 p-3">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs text-white font-medium">
																	{short(comment.authorAddress)}
																</span>
																<span className="text-xs text-gray-500">
																	{formatTimestamp(comment.createdAt)}
																</span>
															</div>
															<p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						))
					)}
				</div>
			</section>
		</div>
	);
}
