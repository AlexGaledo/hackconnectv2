import { useState } from "react";

export default function MessageInput({ onSendMessage, disabled }) {
	const [input, setInput] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.trim() && !disabled) {
			onSendMessage(input.trim());
			setInput("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
			<div className="flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type your message..."
					disabled={disabled}
					className="flex-1 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none px-4 py-2.5 text-white placeholder-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
				/>
				<button
					type="submit"
					disabled={!input.trim() || disabled}
					className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-400/30 text-white hover:from-blue-500/30 hover:to-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5"
					>
						<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
					</svg>
				</button>
			</div>
		</form>
	);
}
