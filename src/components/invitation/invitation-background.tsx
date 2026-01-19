import type { ReactNode } from "react";

interface InvitationBackgroundProps {
	children: ReactNode;
}

export function InvitationBackground({ children }: InvitationBackgroundProps) {
	return (
		<div className="min-h-screen bg-wedding-bg relative overflow-hidden">
			{/* Subtle gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-wedding-blush/20 via-transparent to-wedding-rose/10 pointer-events-none" />

			{/* Paper texture effect - lighter in dark mode */}
			<div
				className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none dark:invert"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Decorative gold border lines */}
			<div className="absolute top-4 left-4 right-4 bottom-4 border border-wedding-gold/20 pointer-events-none" />
			<div className="absolute top-6 left-6 right-6 bottom-6 border border-wedding-gold/10 pointer-events-none" />

			{/* Content */}
			<div className="relative z-10">{children}</div>
		</div>
	);
}
