import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { FloralCorner } from "./floral-decorations";

interface InvitationCardProps {
	isOpening: boolean;
	isOpen: boolean;
	onOpenComplete: () => void;
	children: ReactNode;
}

export function InvitationCard({
	isOpening,
	isOpen,
	onOpenComplete,
	children,
}: InvitationCardProps) {
	return (
		<div className="envelope-perspective w-full max-w-2xl mx-auto">
			{/* Envelope back */}
			<div className="relative bg-wedding-card-bg rounded-lg invitation-shadow">
				{/* Envelope flap (top triangle) */}
				<AnimatePresence>
					{(isOpening || !isOpen) && (
						<motion.div
							className="absolute top-0 left-0 right-0 h-32 origin-top overflow-hidden z-10"
							initial={{ rotateX: 0 }}
							animate={isOpening ? { rotateX: -180 } : { rotateX: 0 }}
							exit={{ rotateX: -180, opacity: 0 }}
							transition={{ duration: 0.8, ease: "easeInOut" }}
							onAnimationComplete={() => {
								if (isOpening) {
									onOpenComplete();
								}
							}}
							style={{ transformStyle: "preserve-3d" }}
						>
							{/* Front of flap */}
							<div
								className="absolute inset-0 bg-gradient-to-b from-wedding-blush to-wedding-card-bg"
								style={{
									clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									backfaceVisibility: "hidden",
								}}
							>
								{/* Decorative pattern on flap */}
								<div className="absolute inset-0 flex items-start justify-center pt-4">
									<svg
										width="60"
										height="40"
										viewBox="0 0 60 40"
										fill="none"
										className="text-wedding-gold opacity-30"
										aria-hidden="true"
									>
										<path
											d="M30 5 L45 20 L30 35 L15 20 Z"
											stroke="currentColor"
											strokeWidth="1"
											fill="none"
										/>
										<circle cx="30" cy="20" r="5" fill="currentColor" />
									</svg>
								</div>
							</div>
							{/* Back of flap (visible when opened) */}
							<div
								className="absolute inset-0 bg-wedding-card-bg"
								style={{
									clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									backfaceVisibility: "hidden",
									transform: "rotateX(180deg)",
								}}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Card content area */}
				<motion.div
					className="relative bg-wedding-card-bg rounded-lg p-8 sm:p-12 min-h-[600px]"
					initial={{ y: 50, opacity: 0 }}
					animate={isOpen ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
					transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
				>
					{/* Floral corners */}
					<FloralCorner
						position="top-left"
						className="w-20 h-20 sm:w-28 sm:h-28"
					/>
					<FloralCorner
						position="top-right"
						className="w-20 h-20 sm:w-28 sm:h-28"
					/>
					<FloralCorner
						position="bottom-left"
						className="w-20 h-20 sm:w-28 sm:h-28"
					/>
					<FloralCorner
						position="bottom-right"
						className="w-20 h-20 sm:w-28 sm:h-28"
					/>

					{/* Inner border */}
					<div className="absolute inset-6 sm:inset-10 border border-wedding-gold/30 rounded pointer-events-none" />

					{/* Content */}
					<div className="relative z-10">{children}</div>
				</motion.div>
			</div>
		</div>
	);
}
