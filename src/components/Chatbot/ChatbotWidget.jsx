import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotWidget() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Chatbot Window */}
			<ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />

			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border border-gray-600 bg-gray-800 hover:bg-gray-700 shadow-2xl transition-all duration-300 flex items-center justify-center"
				aria-label="Toggle chat"
			>
				{isOpen ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-6 h-6 text-white"
					>
						<path
							fillRule="evenodd"
							d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-6 h-6 text-white"
					>
						<path
							fillRule="evenodd"
							d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z"
							clipRule="evenodd"
						/>
					</svg>
				)}
			</button>
		</>
	);
}
