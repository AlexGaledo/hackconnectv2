import { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Format message content with markdown-like syntax
	const formatMessage = (content) => {
		if (!content) return null;

		// Split by paragraphs
		const paragraphs = content.split('\n\n');
		
		return paragraphs.map((paragraph, pIdx) => {
			// Check if it's a bullet list
			if (paragraph.includes('* **')) {
				const items = paragraph.split('\n').filter(line => line.trim());
				return (
					<ul key={pIdx} className="space-y-2 mt-2">
						{items.map((item, iIdx) => {
							// Extract bold text and regular text
							const match = item.match(/\* \*\*(.*?)\*\*:\s*(.*)/);
							if (match) {
								return (
									<li key={iIdx} className="flex gap-2">
										<span className="text-blue-400 mt-0.5">•</span>
										<div>
											<span className="font-semibold text-white">{match[1]}:</span>
											<span className="text-gray-300"> {match[2]}</span>
										</div>
									</li>
								);
							}
							return null;
						})}
					</ul>
				);
			}
			
			// Regular paragraph - handle inline bold
			const parts = paragraph.split(/(\*\*.*?\*\*)/g);
			return (
				<p key={pIdx} className="mb-2 last:mb-0">
					{parts.map((part, partIdx) => {
						if (part.startsWith('**') && part.endsWith('**')) {
							return <span key={partIdx} className="font-semibold text-white">{part.slice(2, -2)}</span>;
						}
						return <span key={partIdx}>{part}</span>;
					})}
				</p>
			);
		});
	};

	return (
		<div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
			{messages.length === 0 ? (
				<div className="flex items-center justify-center h-full">
					<div className="text-center text-gray-400 text-sm">
						<p>👋 Hello! How can I help you today?</p>
						<p className="text-xs mt-2 text-gray-500">Ask me anything about events, tickets, or rewards.</p>
					</div>
				</div>
			) : (
				messages.map((msg, idx) => (
					<div
						key={idx}
						className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
								msg.role === "user"
									? "bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-400/30 text-white"
									: "bg-white/5 border border-white/10 text-gray-200"
							}`}
						>
							<div className="whitespace-pre-wrap leading-relaxed">
								{msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
							</div>
							{msg.timestamp && (
								<div className="text-[10px] text-gray-500 mt-1">
									{new Date(msg.timestamp).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							)}
						</div>
					</div>
				))
			)}
			<div ref={messagesEndRef} />
		</div>
	);
}
