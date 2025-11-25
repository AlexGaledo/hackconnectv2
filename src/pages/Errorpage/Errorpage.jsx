import { useNavigate } from 'react-router-dom';
import { btnPrimary } from '../../styles/reusables';

export default function ErrorPage() {
	const navigate = useNavigate();

	return (
		<div className="relative min-h-[70vh] flex flex-col">
			<div className="absolute inset-0 z-0">
				{[0,1,2,3].map(i => (
					<div
						key={i}
						className="absolute rounded-xl bg-white/0 border border-white/5 backdrop-blur-md"
						style={{
							width: '336px',
							height: '100%',
							top: 0,
							left: `${i * 25}%`,
							WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
							maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
						}}
					/>
				))}
			</div>

			<section className="relative z-10 pt-16 pb-8 px-4 sm:px-6 flex-1">
				<div className="container mx-auto max-w-xl text-center">
					<h1
						className="text-5xl font-semibold bg-clip-text text-transparent"
						style={{ backgroundImage: 'linear-gradient(to bottom, #d8e0e6 0%, #f0f3f6 60%, #ffffff 100%)' }}
					>404</h1>
					<p className="mt-3 text-white/90 text-lg font-medium">Page Not Found</p>
					<p className="mt-2 text-xs text-gray-300/70 leading-relaxed">
						The route you tried to access does not exist or may have been moved. Double check the URL or choose a destination below.
					</p>

					<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
						<button className={btnPrimary} onClick={() => navigate('/')}>Home</button>
						<button className={btnPrimary} onClick={() => navigate('/Dashboard')}>Dashboard</button>
						<button className={btnPrimary} onClick={() => navigate('/Events')}>Browse Events</button>
					</div>

					<div className="mt-10 rounded-2xl backdrop-blur-sm bg-white/0 border border-white/5 p-4 inline-block">
						<div className="text-[11px] text-gray-400">If you believe this is an error, refresh or return later.</div>
					</div>
				</div>
			</section>
		</div>
	);
}
