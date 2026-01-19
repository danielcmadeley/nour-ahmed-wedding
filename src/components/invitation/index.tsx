import { AnimatePresence, motion } from "motion/react";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { useInvitationAnimation } from "@/src/hooks/use-invitation-animation";
import { InvitationBackground } from "./invitation-background";
import { InvitationCard } from "./invitation-card";
import { InvitationContent } from "./invitation-content";
import { WaxSeal } from "./wax-seal";

export function Invitation() {
	const {
		phase,
		hasOpened,
		startAnimation,
		onSealBroken,
		onCardOpened,
		onRevealComplete,
		resetAnimation,
	} = useInvitationAnimation();

	const isSealed = phase === "sealed";
	const isBreaking = phase === "breaking";
	const isOpening = phase === "opening";
	// Start revealing content once card is open (includes opening phase for smoother experience)
	const isRevealing =
		phase === "opening" || phase === "revealing" || phase === "complete";
	const isOpen =
		phase === "opening" || phase === "revealing" || phase === "complete";

	return (
		<InvitationBackground>
			{/* Theme toggle */}
			<div className="fixed top-4 right-4 z-50">
				<ThemeToggle />
			</div>

			<div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
				{/* Sealed state - show wax seal */}
				<AnimatePresence mode="wait">
					{(isSealed || isBreaking) && (
						<motion.div
							key="sealed"
							className="flex flex-col items-center justify-center"
							initial={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							{/* Envelope preview */}
							<div className="relative w-80 sm:w-96 h-56 sm:h-64 bg-wedding-card-bg rounded-lg shadow-xl mb-8 border border-wedding-border">
								{/* Envelope flap (closed) */}
								<div
									className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-b from-wedding-blush to-wedding-card-bg"
									style={{
										clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									}}
								/>
								{/* Envelope body lines */}
								<div className="absolute bottom-4 left-8 right-8 space-y-2">
									<div className="h-0.5 bg-wedding-gold/30 rounded" />
									<div className="h-0.5 bg-wedding-gold/30 rounded w-3/4" />
									<div className="h-0.5 bg-wedding-gold/30 rounded w-1/2" />
								</div>
							</div>

							{/* Wax seal positioned over the envelope */}
							<div className="absolute">
								<WaxSeal
									onClick={startAnimation}
									isBreaking={isBreaking}
									onBreakComplete={onSealBroken}
								/>
							</div>

							{/* Title below */}
							<motion.div
								className="text-center mt-16"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<h2 className="font-script text-4xl sm:text-5xl text-wedding-burgundy mb-2">
									You're Invited
								</h2>
								<p className="font-serif text-wedding-burgundy/60">
									A Wedding Celebration
								</p>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Opening/Open state - show invitation card */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							key="open"
							className="w-full"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<InvitationCard
								isOpening={isOpening}
								isOpen={isOpen}
								onOpenComplete={onCardOpened}
							>
								<InvitationContent
									isRevealing={isRevealing}
									onRevealComplete={onRevealComplete}
								/>
							</InvitationCard>

							{/* Reset button (for demo purposes, can be removed in production) */}
							{hasOpened && phase === "complete" && (
								<motion.div
									className="text-center mt-8"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1 }}
								>
									<button
										type="button"
										onClick={resetAnimation}
										className="font-serif text-sm text-wedding-burgundy/50 hover:text-wedding-burgundy/70 underline transition-colors"
									>
										Replay animation
									</button>
								</motion.div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</InvitationBackground>
	);
}

export { FloralCorner, FloralDivider } from "./floral-decorations";
export { InvitationBackground } from "./invitation-background";
export { InvitationCard } from "./invitation-card";
export { InvitationContent } from "./invitation-content";
export { RsvpForm } from "./rsvp-form";
export { WaxSeal } from "./wax-seal";
