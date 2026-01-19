import gsap from "gsap";
import { useEffect, useRef } from "react";

interface WaxSealProps {
	onClick: () => void;
	isBreaking: boolean;
	onBreakComplete: () => void;
}

export function WaxSeal({
	onClick,
	isBreaking,
	onBreakComplete,
}: WaxSealProps) {
	const sealRef = useRef<SVGSVGElement>(null);
	const fragmentsRef = useRef<SVGGElement>(null);
	const roundValue = (value: number) => Math.round(value * 1000) / 1000;

	useEffect(() => {
		if (!isBreaking || !sealRef.current || !fragmentsRef.current) return;

		const tl = gsap.timeline({
			onComplete: onBreakComplete,
		});

		// Get all fragment pieces
		const fragments = fragmentsRef.current.children;

		// Anticipation - slight pull back
		tl.to(sealRef.current, {
			scale: 0.95,
			duration: 0.1,
			ease: "power2.in",
		});

		// Pop effect
		tl.to(sealRef.current, {
			scale: 1.15,
			duration: 0.12,
			ease: "power2.out",
		});

		// Subtle shake
		tl.to(sealRef.current, {
			x: "+=2",
			duration: 0.03,
			repeat: 4,
			yoyo: true,
			ease: "none",
		});

		// Break apart - fragments fly outward
		tl.to(
			fragments,
			{
				opacity: 1,
				duration: 0.08,
			},
			"break",
		);

		// Animate each fragment outward with varied physics
		Array.from(fragments).forEach((fragment, i) => {
			const angle = (i / fragments.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
			const distance = 120 + Math.random() * 80;
			const rotation = (Math.random() - 0.5) * 540;
			const duration = 0.6 + Math.random() * 0.3;

			tl.to(
				fragment,
				{
					x: Math.cos(angle) * distance,
					y: Math.sin(angle) * distance + 30, // Add gravity effect
					rotation: rotation,
					opacity: 0,
					scale: 0.3 + Math.random() * 0.3,
					duration: duration,
					ease: "power2.out",
				},
				"break",
			);
		});

		// Hide main seal with fade
		tl.to(
			".seal-main",
			{
				opacity: 0,
				scale: 0.6,
				duration: 0.25,
				ease: "power2.in",
			},
			"break",
		);

		return () => {
			tl.kill();
		};
	}, [isBreaking, onBreakComplete]);

	return (
		<div className="relative group">
			<svg
				ref={sealRef}
				width="160"
				height="160"
				viewBox="0 0 160 160"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				onClick={!isBreaking ? onClick : undefined}
				onKeyDown={(e) => {
					if (!isBreaking && (e.key === "Enter" || e.key === " ")) {
						e.preventDefault();
						onClick();
					}
				}}
				className={`wax-seal transition-transform duration-300 ${isBreaking ? "pointer-events-none" : "hover:scale-105 active:scale-95"}`}
				role="button"
				tabIndex={isBreaking ? -1 : 0}
				aria-label="Click to open invitation"
			>
				{/* Fragment pieces (initially hidden) */}
				<g ref={fragmentsRef} className="fragments">
					{[...Array(10)].map((_, i) => {
						const angle = (i / 10) * Math.PI * 2;
						const startX = roundValue(80 + Math.cos(angle - 0.25) * 50);
						const startY = roundValue(80 + Math.sin(angle - 0.25) * 50);
						const endX = roundValue(80 + Math.cos(angle + 0.25) * 50);
						const endY = roundValue(80 + Math.sin(angle + 0.25) * 50);
						return (
							<path
								key={i}
								d={`M80 80 L${startX} ${startY} A50 50 0 0 1 ${endX} ${endY} Z`}
								fill="url(#fragmentGradient)"
								opacity="0"
							/>
						);
					})}
				</g>

				{/* Main seal body */}
				<g className="seal-main">
					{/* Outer shadow ring for depth */}
					<circle
						cx="80"
						cy="80"
						r="62"
						fill="url(#waxGradient)"
						filter="url(#sealShadow)"
					/>

					{/* Organic wax edge - irregular border */}
					<circle
						cx="80"
						cy="80"
						r="60"
						fill="url(#waxGradient)"
					/>

					{/* Wax drips - more organic shapes */}
					<ellipse cx="32" cy="95" rx="10" ry="14" fill="url(#dripGradient)" />
					<ellipse cx="40" cy="108" rx="6" ry="8" fill="url(#dripGradient)" opacity="0.8" />
					<ellipse cx="128" cy="90" rx="8" ry="12" fill="url(#dripGradient)" />
					<ellipse cx="120" cy="105" rx="5" ry="7" fill="url(#dripGradient)" opacity="0.8" />
					<ellipse cx="80" cy="132" rx="12" ry="10" fill="url(#dripGradient)" />
					<ellipse cx="65" cy="128" rx="6" ry="8" fill="url(#dripGradient)" opacity="0.7" />
					<ellipse cx="95" cy="126" rx="5" ry="7" fill="url(#dripGradient)" opacity="0.7" />

					{/* Inner pressed area */}
					<circle
						cx="80"
						cy="80"
						r="50"
						fill="url(#innerWaxGradient)"
					/>

					{/* Decorative ring */}
					<circle
						cx="80"
						cy="80"
						r="46"
						fill="none"
						stroke="url(#ringGradient)"
						strokeWidth="1.5"
						opacity="0.6"
					/>

					{/* Inner decorative ring */}
					<circle
						cx="80"
						cy="80"
						r="42"
						fill="none"
						stroke="#5C0000"
						strokeWidth="0.5"
						opacity="0.4"
					/>

					{/* Monogram background */}
					<circle cx="80" cy="80" r="36" fill="url(#monogramGradient)" />

					{/* Initials with better styling */}
					<text
						x="80"
						y="90"
						textAnchor="middle"
						fill="url(#goldGradient)"
						fontSize="32"
						fontFamily="Great Vibes, cursive"
						className="font-script"
						filter="url(#textEmboss)"
					>
						N&A
					</text>

					{/* Decorative beads around the seal */}
					{[...Array(16)].map((_, i) => {
						const angle = (i / 16) * Math.PI * 2;
						const cx = roundValue(80 + Math.cos(angle) * 53);
						const cy = roundValue(80 + Math.sin(angle) * 53);
						return (
							<circle
								key={i}
								cx={cx}
								cy={cy}
								r="1.8"
								fill="url(#goldGradient)"
								opacity={0.5 + (Math.sin(angle * 2) * 0.2)}
							/>
						);
					})}

					{/* Primary highlight - top left */}
					<ellipse
						cx="58"
						cy="58"
						rx="20"
						ry="14"
						fill="white"
						opacity="0.18"
						transform="rotate(-45 58 58)"
					/>
					
					{/* Secondary highlight */}
					<ellipse
						cx="50"
						cy="65"
						rx="10"
						ry="6"
						fill="white"
						opacity="0.12"
						transform="rotate(-45 50 65)"
					/>

					{/* Subtle rim highlight */}
					<circle
						cx="80"
						cy="80"
						r="58"
						fill="none"
						stroke="white"
						strokeWidth="0.5"
						opacity="0.1"
					/>
				</g>

				{/* Definitions */}
				<defs>
					<radialGradient id="waxGradient" cx="35%" cy="35%" r="65%" fx="25%" fy="25%">
						<stop offset="0%" stopColor="#C44545" />
						<stop offset="30%" stopColor="#A52A2A" />
						<stop offset="60%" stopColor="#8B0000" />
						<stop offset="100%" stopColor="#4A0000" />
					</radialGradient>
					
					<radialGradient id="innerWaxGradient" cx="40%" cy="40%" r="60%" fx="30%" fy="30%">
						<stop offset="0%" stopColor="#9B2C2C" />
						<stop offset="50%" stopColor="#7B0000" />
						<stop offset="100%" stopColor="#5C0000" />
					</radialGradient>
					
					<radialGradient id="monogramGradient" cx="40%" cy="40%" r="60%" fx="35%" fy="35%">
						<stop offset="0%" stopColor="#8B2020" />
						<stop offset="100%" stopColor="#6B0000" />
					</radialGradient>
					
					<linearGradient id="dripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#9B2020" />
						<stop offset="100%" stopColor="#6B0000" />
					</linearGradient>
					
					<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#6B0000" />
						<stop offset="50%" stopColor="#8B0000" />
						<stop offset="100%" stopColor="#5C0000" />
					</linearGradient>
					
					<linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#FFE066" />
						<stop offset="50%" stopColor="#FFD700" />
						<stop offset="100%" stopColor="#DAA520" />
					</linearGradient>
					
					<radialGradient id="fragmentGradient" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#A52A2A" />
						<stop offset="100%" stopColor="#6B0000" />
					</radialGradient>
					
					<filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
						<feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
						<feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
					</filter>
					
					<filter id="textEmboss" x="-10%" y="-10%" width="120%" height="120%">
						<feDropShadow dx="0.5" dy="0.5" stdDeviation="0.3" floodColor="#FFE066" floodOpacity="0.3" />
						<feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.2" floodColor="#4A0000" floodOpacity="0.4" />
					</filter>
				</defs>
			</svg>

			{/* Click prompt with refined animation */}
			{!isBreaking && (
				<div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
					<p className="text-sm text-wedding-burgundy/60 font-serif whitespace-nowrap tracking-wide">
						<span className="inline-block animate-pulse">Tap to open</span>
					</p>
				</div>
			)}
		</div>
	);
}
