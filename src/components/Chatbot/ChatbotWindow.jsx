import { useState } from "react";
import MessageList from "./Messagelist";
import MessageInput from "./MessageInput";
import { connector } from "../../api/axios";

export default function ChatbotWindow({ isOpen, onClose }) {
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: "Hi! I'm your HackConnect assistant. I can help you with events, tickets, and rewards.",
			timestamp: new Date().toISOString(),
		},
	]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async (content) => {
		// Add user message
		const userMessage = {
			role: "user",
			content,
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			// TODO: Replace with your backend API call
			// Example:
			// const response = await connector.post('/chatbot/message', { message: content });
			// const botReply = response.data.reply;

			// Simulated response for now (remove this when connecting to backend)

            const response = await connector.post(`chatbot/chatbotInput`,{
                user_message:content
            });

			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (response.status !== 200) {
                throw new Error("Failed to get response from chatbot");
            }

            console.log("Chatbot response data:", response.data);
            const botReply = response.data.response;

			const assistantMessage = {
				role: "assistant",
				content: botReply,
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, assistantMessage]);

		} catch (error) {
			console.error("Chatbot error:", error);
			const errorMessage = {
				role: "assistant",
				content: "Sorry, I encountered an error. Please try again.",
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl bg-gray-900/95 border border-gray-700 shadow-2xl flex flex-col overflow-hidden"
		>
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-5 h-5 text-white"
						>
							<path
								fillRule="evenodd"
								d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<div>
						<h3 className="text-white font-semibold text-sm">C O N N Y</h3>
						<p className="text-gray-300/70 text-xs">Your assistant chatbot</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className="w-8 h-8 rounded-full hover:bg-gray-800 transition flex items-center justify-center text-gray-400 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5"
					>
						<path
							fillRule="evenodd"
							d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>

			{/* Messages */}
			<MessageList messages={messages} />

			{/* Loading indicator */}
			{isLoading && (
				<div className="px-4 pb-2">
					<div className="flex items-center gap-2 text-gray-400 text-sm">
						<div className="flex gap-1">
							<div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
							<div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
							<div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
						</div>
						<span>Typing...</span>
					</div>
				</div>
			)}

			{/* Input */}
			<MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
		</div>
	);
}
