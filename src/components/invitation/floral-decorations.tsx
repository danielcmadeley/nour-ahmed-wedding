interface FloralCornerProps {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	className?: string;
}

export function FloralCorner({ position, className = "" }: FloralCornerProps) {
	const rotations = {
		"top-left": "rotate-0",
		"top-right": "rotate-90",
		"bottom-right": "rotate-180",
		"bottom-left": "-rotate-90",
	};

	const positions = {
		"top-left": "top-0 left-0",
		"top-right": "top-0 right-0",
		"bottom-left": "bottom-0 left-0",
		"bottom-right": "bottom-0 right-0",
	};

	return (
		<div
			className={`absolute ${positions[position]} ${rotations[position]} ${className}`}
		>
			<svg
				width="120"
				height="120"
				viewBox="0 0 120 120"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="text-wedding-sage"
				aria-hidden="true"
			>
				{/* Main stem */}
				<path
					d="M0 0 C20 30, 40 50, 60 60 C40 70, 20 90, 0 120"
					stroke="currentColor"
					strokeWidth="1.5"
					fill="none"
					opacity="0.6"
				/>
				{/* Secondary stems */}
				<path
					d="M0 20 C15 35, 25 45, 35 50"
					stroke="currentColor"
					strokeWidth="1"
					fill="none"
					opacity="0.5"
				/>
				<path
					d="M20 0 C35 15, 45 25, 50 35"
					stroke="currentColor"
					strokeWidth="1"
					fill="none"
					opacity="0.5"
				/>
				{/* Leaves */}
				<ellipse
					cx="25"
					cy="25"
					rx="12"
					ry="6"
					fill="currentColor"
					opacity="0.3"
					transform="rotate(-45 25 25)"
				/>
				<ellipse
					cx="40"
					cy="40"
					rx="10"
					ry="5"
					fill="currentColor"
					opacity="0.25"
					transform="rotate(-45 40 40)"
				/>
				<ellipse
					cx="15"
					cy="45"
					rx="8"
					ry="4"
					fill="currentColor"
					opacity="0.2"
					transform="rotate(-30 15 45)"
				/>
				<ellipse
					cx="45"
					cy="15"
					rx="8"
					ry="4"
					fill="currentColor"
					opacity="0.2"
					transform="rotate(-60 45 15)"
				/>
				{/* Small flowers */}
				<circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.15" />
				<circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.15" />
				{/* Rose accent */}
				<g transform="translate(55 55)" className="text-wedding-rose">
					<circle cx="0" cy="0" r="6" fill="currentColor" opacity="0.4" />
					<circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.6" />
				</g>
			</svg>
		</div>
	);
}

export function FloralDivider({ className = "" }: { className?: string }) {
	return (
		<div className={`flex items-center justify-center ${className}`}>
			<svg
				width="200"
				height="30"
				viewBox="0 0 200 30"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="text-wedding-gold"
				aria-hidden="true"
			>
				{/* Left branch */}
				<path
					d="M0 15 C30 15, 50 10, 70 15 C80 12, 90 12, 100 15"
					stroke="currentColor"
					strokeWidth="1"
					fill="none"
					opacity="0.6"
				/>
				{/* Right branch */}
				<path
					d="M200 15 C170 15, 150 10, 130 15 C120 12, 110 12, 100 15"
					stroke="currentColor"
					strokeWidth="1"
					fill="none"
					opacity="0.6"
				/>
				{/* Center ornament */}
				<circle cx="100" cy="15" r="4" fill="currentColor" opacity="0.5" />
				<circle cx="100" cy="15" r="2" fill="currentColor" opacity="0.8" />
				{/* Left leaves */}
				<ellipse
					cx="40"
					cy="12"
					rx="8"
					ry="3"
					fill="currentColor"
					opacity="0.3"
					transform="rotate(-15 40 12)"
				/>
				<ellipse
					cx="60"
					cy="18"
					rx="6"
					ry="2.5"
					fill="currentColor"
					opacity="0.25"
					transform="rotate(10 60 18)"
				/>
				{/* Right leaves */}
				<ellipse
					cx="160"
					cy="12"
					rx="8"
					ry="3"
					fill="currentColor"
					opacity="0.3"
					transform="rotate(15 160 12)"
				/>
				<ellipse
					cx="140"
					cy="18"
					rx="6"
					ry="2.5"
					fill="currentColor"
					opacity="0.25"
					transform="rotate(-10 140 18)"
				/>
			</svg>
		</div>
	);
}
