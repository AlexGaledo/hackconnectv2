import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MessageModalContext = createContext(null);

export function MessageModalProvider({ children }) {
	const [modal, setModal] = useState(null); // { title, message, type, actions, autoCloseMs }

	const hideMessage = useCallback(() => setModal(null), []);

	const showMessage = useCallback((config) => {
		setModal({
			title: config.title || 'Notice',
			message: config.message || '',
			type: config.type || 'info', // info | success | warning | error
			actions: config.actions || [],
			autoCloseMs: config.autoCloseMs || null,
		});
	}, []);

	useEffect(() => {
		if (modal?.autoCloseMs) {
			const t = setTimeout(() => hideMessage(), modal.autoCloseMs);
			return () => clearTimeout(t);
		}
	}, [modal, hideMessage]);

	const value = { showMessage, hideMessage, modal };

	return (
		<MessageModalContext.Provider value={value}>
			{children}
			{createPortal(<MessageModal />, document.body)}
		</MessageModalContext.Provider>
	);
}

export function useMessageModal() {
	const ctx = useContext(MessageModalContext);
	if (!ctx) throw new Error('useMessageModal must be used within MessageModalProvider');
	return ctx;
}

function MessageModal() {
	const { modal, hideMessage } = useMessageModal();
	const typeColor = {
		info: 'from-blue-400/70 to-blue-300/40',
		success: 'from-green-400/70 to-green-300/40',
		warning: 'from-yellow-400/70 to-yellow-300/40',
		error: 'from-red-400/70 to-red-300/40',
	}[modal?.type || 'info'];

	return (
		<AnimatePresence>
			{modal && (
				<motion.div
					className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div
						onClick={hideMessage}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					/>
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: -10 }}
						transition={{ duration: 0.22 }}
						className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden"
					>
						<div className={`h-1 w-full bg-gradient-to-r ${typeColor}`} />
						<div className="p-5 space-y-3">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-lg font-semibold text-white">{modal.title}</h2>
									<p className="mt-1 text-xs text-gray-300/80 leading-relaxed whitespace-pre-line">{modal.message}</p>
								</div>
								<button
									onClick={hideMessage}
									className="text-xs text-gray-300/70 hover:text-white px-2 py-1 rounded-md hover:bg-white/10"
								>Close</button>
							</div>
							{modal.actions?.length > 0 && (
								<div className="pt-2 flex flex-wrap gap-2">
									{modal.actions.map((a, idx) => (
										<button
											key={idx}
											onClick={() => { a.onClick?.(); if (!a.persist) hideMessage(); }}
											className={`h-9 px-4 rounded-full border border-white/10 text-xs font-medium transition
												${a.variant === 'primary' ? 'bg-white/15 text-white hover:bg-white/25' : 'text-gray-300 hover:bg-white/10'}`}
										>{a.label}</button>
									))}
								</div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

/* Usage Example (any component):
	const { showMessage } = useMessageModal();
	showMessage({
		title: 'Ticket Purchased',
		message: 'Your VIP ticket is confirmed!\nCheck email for details.',
		type: 'success',
		autoCloseMs: 4000,
		actions: [
			{ label: 'View Tickets', variant: 'primary', onClick: () => navigate('/Tickets') },
			{ label: 'Close' }
		]
	});
*/
