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

	useEffect(() => {
		if (!isBreaking || !sealRef.current || !fragmentsRef.current) return;

		const tl = gsap.timeline({
			onComplete: onBreakComplete,
		});

		// Get all fragment pieces
		const fragments = fragmentsRef.current.children;

		// Initial crack effect
		tl.to(sealRef.current, {
			scale: 1.1,
			duration: 0.15,
			ease: "power2.in",
		});

		// Shake
		tl.to(sealRef.current, {
			x: "+=3",
			duration: 0.05,
			repeat: 5,
			yoyo: true,
			ease: "none",
		});

		// Break apart - fragments fly outward
		tl.to(
			fragments,
			{
				opacity: 1,
				duration: 0.1,
			},
			"break",
		);

		// Animate each fragment outward
		Array.from(fragments).forEach((fragment, i) => {
			const angle = (i / fragments.length) * Math.PI * 2;
			const distance = 150 + Math.random() * 100;
			const rotation = (Math.random() - 0.5) * 720;

			tl.to(
				fragment,
				{
					x: Math.cos(angle) * distance,
					y: Math.sin(angle) * distance,
					rotation: rotation,
					opacity: 0,
					scale: 0.5,
					duration: 0.8,
					ease: "power2.out",
				},
				"break",
			);
		});

		// Hide main seal
		tl.to(
			".seal-main",
			{
				opacity: 0,
				scale: 0.5,
				duration: 0.3,
			},
			"break",
		);

		return () => {
			tl.kill();
		};
	}, [isBreaking, onBreakComplete]);

	return (
		<div className="relative">
			<svg
				ref={sealRef}
				width="140"
				height="140"
				viewBox="0 0 140 140"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				onClick={!isBreaking ? onClick : undefined}
				onKeyDown={(e) => {
					if (!isBreaking && (e.key === "Enter" || e.key === " ")) {
						e.preventDefault();
						onClick();
					}
				}}
				className={`wax-seal ${isBreaking ? "pointer-events-none" : ""}`}
				role="button"
				tabIndex={isBreaking ? -1 : 0}
				aria-label="Click to open invitation"
			>
				{/* Fragment pieces (initially hidden) */}
				<g ref={fragmentsRef} className="fragments">
					{[...Array(8)].map((_, i) => {
						const angle = (i / 8) * Math.PI * 2;
						return (
							<path
								key={i}
								d={`M70 70 L${70 + Math.cos(angle - 0.3) * 45} ${70 + Math.sin(angle - 0.3) * 45} A45 45 0 0 1 ${70 + Math.cos(angle + 0.3) * 45} ${70 + Math.sin(angle + 0.3) * 45} Z`}
								fill="#8B0000"
								opacity="0"
							/>
						);
					})}
				</g>

				{/* Main seal body */}
				<g className="seal-main">
					{/* Outer ring with wax drips */}
					<circle
						cx="70"
						cy="70"
						r="55"
						fill="url(#waxGradient)"
						filter="url(#sealShadow)"
					/>

					{/* Wax drips */}
					<ellipse
						cx="35"
						cy="85"
						rx="8"
						ry="12"
						fill="#8B0000"
						opacity="0.8"
					/>
					<ellipse
						cx="105"
						cy="80"
						rx="6"
						ry="10"
						fill="#8B0000"
						opacity="0.8"
					/>
					<ellipse
						cx="70"
						cy="115"
						rx="10"
						ry="8"
						fill="#8B0000"
						opacity="0.7"
					/>

					{/* Inner decorative ring */}
					<circle
						cx="70"
						cy="70"
						r="45"
						fill="none"
						stroke="#6B0000"
						strokeWidth="2"
						opacity="0.5"
					/>

					{/* Monogram area */}
					<circle cx="70" cy="70" r="35" fill="#7B0000" />

					{/* Initials */}
					<text
						x="70"
						y="78"
						textAnchor="middle"
						fill="#FFD700"
						fontSize="28"
						fontFamily="Great Vibes, cursive"
						className="font-script"
					>
						N & A
					</text>

					{/* Decorative dots around the seal */}
					{[...Array(12)].map((_, i) => {
						const angle = (i / 12) * Math.PI * 2;
						const cx = 70 + Math.cos(angle) * 48;
						const cy = 70 + Math.sin(angle) * 48;
						return (
							<circle
								key={i}
								cx={cx}
								cy={cy}
								r="2"
								fill="#FFD700"
								opacity="0.6"
							/>
						);
					})}

					{/* Shine highlight */}
					<ellipse
						cx="55"
						cy="55"
						rx="15"
						ry="10"
						fill="white"
						opacity="0.15"
						transform="rotate(-45 55 55)"
					/>
				</g>

				{/* Definitions */}
				<defs>
					<radialGradient
						id="waxGradient"
						cx="40%"
						cy="40%"
						r="60%"
						fx="30%"
						fy="30%"
					>
						<stop offset="0%" stopColor="#A52A2A" />
						<stop offset="50%" stopColor="#8B0000" />
						<stop offset="100%" stopColor="#5C0000" />
					</radialGradient>
					<filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
						<feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.4" />
					</filter>
				</defs>
			</svg>

			{/* Click prompt */}
			{!isBreaking && (
				<p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-wedding-burgundy/70 font-serif whitespace-nowrap animate-pulse">
					Click to open
				</p>
			)}
		</div>
	);
}
