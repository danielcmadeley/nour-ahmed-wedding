import { AnimatePresence, motion } from "motion/react";
import { useInvitationAnimation } from "@/src/hooks/use-invitation-animation";
import { InvitationBackground } from "./invitation-background";
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
	const isRevealing = phase === "revealing";
	const isComplete = phase === "complete";
	const showEnvelope = isSealed || isBreaking || isOpening;
	const flapOpen = isOpening;
	const showInvitation = isRevealing || isComplete;

	return (
		<>
			{/* Full screen envelope */}
			<AnimatePresence mode="wait">
				{showEnvelope && (
					<motion.div
						key="envelope"
						className="fixed inset-0 w-full h-full overflow-hidden"
						style={{ perspective: "2000px" }}
						initial={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					>
						{/* Ambient background gradient */}
						<div className="absolute inset-0 bg-gradient-to-br from-wedding-cream via-wedding-ivory to-wedding-blush/30" />

						{/* Envelope body - full screen */}
						<div className="absolute inset-0">
							{/* Main envelope surface */}
							<div className="absolute inset-0 bg-gradient-to-b from-wedding-ivory via-wedding-card-bg to-wedding-cream" />
							
							{/* Paper texture overlay */}
							<div 
								className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
								style={{
									backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
								}}
							/>
							
							{/* Subtle vignette effect */}
							<div 
								className="absolute inset-0 pointer-events-none"
								style={{
									background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.08) 100%)"
								}}
							/>
							
							{/* Left fold with layered shadows */}
							<div className="absolute top-0 bottom-0 left-0 w-[35%]">
								<div 
									className="absolute inset-0 bg-gradient-to-r from-wedding-rose/20 via-wedding-blush/30 to-transparent"
									style={{ clipPath: "polygon(0 0, 100% 12%, 100% 88%, 0 100%)" }}
								/>
								<div 
									className="absolute inset-0 bg-gradient-to-r from-black/[0.03] to-transparent"
									style={{ clipPath: "polygon(0 0, 60% 12%, 60% 88%, 0 100%)" }}
								/>
							</div>
							
							{/* Right fold with layered shadows */}
							<div className="absolute top-0 bottom-0 right-0 w-[35%]">
								<div 
									className="absolute inset-0 bg-gradient-to-l from-wedding-rose/20 via-wedding-blush/30 to-transparent"
									style={{ clipPath: "polygon(100% 0, 0 12%, 0 88%, 100% 100%)" }}
								/>
								<div 
									className="absolute inset-0 bg-gradient-to-l from-black/[0.03] to-transparent"
									style={{ clipPath: "polygon(100% 0, 40% 12%, 40% 88%, 100% 100%)" }}
								/>
							</div>
							
							{/* Bottom flap with depth */}
							<div className="absolute bottom-0 left-0 right-0 h-[35%]">
								<div 
									className="absolute inset-0 bg-gradient-to-t from-wedding-blush/60 via-wedding-rose/30 to-transparent"
									style={{ clipPath: "polygon(0 100%, 50% 15%, 100% 100%)" }}
								/>
								{/* Inner shadow on bottom flap */}
								<div 
									className="absolute inset-0 bg-gradient-to-t from-black/[0.04] to-transparent"
									style={{ clipPath: "polygon(5% 100%, 50% 25%, 95% 100%)" }}
								/>
							</div>

							{/* Decorative gold border - outer */}
							<div className="absolute inset-8 sm:inset-12 md:inset-16 border border-wedding-gold/15 pointer-events-none" />
							
							{/* Decorative gold border - inner */}
							<div className="absolute inset-10 sm:inset-14 md:inset-20 border border-wedding-gold/10 pointer-events-none" />
							
							{/* Corner flourishes */}
							<div className="absolute top-10 left-10 sm:top-14 sm:left-14 md:top-20 md:left-20 w-8 h-8 border-t-2 border-l-2 border-wedding-gold/20" />
							<div className="absolute top-10 right-10 sm:top-14 sm:right-14 md:top-20 md:right-20 w-8 h-8 border-t-2 border-r-2 border-wedding-gold/20" />
							<div className="absolute bottom-10 left-10 sm:bottom-14 sm:left-14 md:bottom-20 md:left-20 w-8 h-8 border-b-2 border-l-2 border-wedding-gold/20" />
							<div className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14 md:bottom-20 md:right-20 w-8 h-8 border-b-2 border-r-2 border-wedding-gold/20" />
						</div>

						{/* Top flap - animates open */}
						<motion.div
							className="absolute top-0 left-0 right-0 h-[48%] origin-top z-10"
							style={{ transformStyle: "preserve-3d" }}
							initial={{ rotateX: 0 }}
							animate={{ rotateX: flapOpen ? -180 : 0 }}
							transition={{ 
								duration: 1.5, 
								ease: [0.34, 1.56, 0.64, 1],
							}}
							onAnimationComplete={() => {
								if (flapOpen) {
									setTimeout(onCardOpened, 200);
								}
							}}
						>
							{/* Front of flap (visible when closed) */}
							<div 
								className="absolute inset-0"
								style={{ 
									clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									backfaceVisibility: "hidden"
								}}
							>
								{/* Flap gradient layers */}
								<div className="absolute inset-0 bg-gradient-to-b from-wedding-blush via-wedding-rose/40 to-wedding-card-bg" 
									style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} 
								/>
								
								{/* Subtle inner shadow on flap */}
								<div 
									className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/[0.05]"
									style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
								/>
								
								{/* Flap edge highlight */}
								<div 
									className="absolute inset-0"
									style={{ 
										clipPath: "polygon(0 0, 50% 100%, 100% 0)",
										boxShadow: "inset 0 -2px 4px rgba(255,255,255,0.3)"
									}}
								/>
								
								{/* Decorative border on flap */}
								<div 
									className="absolute inset-8 sm:inset-12 md:inset-16 border-t border-l border-r border-wedding-gold/15"
									style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
								/>
							</div>
							
							{/* Back of flap (visible when open) */}
							<div 
								className="absolute inset-0 bg-gradient-to-t from-wedding-cream via-wedding-ivory to-wedding-card-bg"
								style={{ 
									clipPath: "polygon(0 0, 50% 100%, 100% 0)",
									backfaceVisibility: "hidden",
									transform: "rotateX(180deg)"
								}}
							/>
						</motion.div>

						{/* Wax seal - centered on screen where flap meets */}
						<AnimatePresence>
							{(isSealed || isBreaking) && (
								<motion.div
									className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 z-20"
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ 
										duration: 0.5, 
										ease: [0.22, 1, 0.36, 1],
										exit: { duration: 0.3 }
									}}
								>
									<WaxSeal
										onClick={startAnimation}
										isBreaking={isBreaking}
										onBreakComplete={onSealBroken}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Title text - shown when sealed */}
						<AnimatePresence>
							{(isSealed || isBreaking) && (
								<motion.div
									className="absolute bottom-16 sm:bottom-20 left-0 right-0 text-center px-4 z-10"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
								>
									<motion.h2 
										className="font-script text-5xl sm:text-6xl md:text-7xl text-wedding-burgundy mb-3 drop-shadow-sm"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6, duration: 0.8 }}
									>
										You're Invited
									</motion.h2>
									<motion.p 
										className="font-serif text-lg sm:text-xl text-wedding-burgundy/60 tracking-widest uppercase"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.9, duration: 0.6 }}
									>
										A Wedding Celebration
									</motion.p>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Invitation - only shown after envelope opens */}
			<AnimatePresence>
				{showInvitation && (
					<InvitationBackground>
						<motion.div
							key="invitation"
							className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
							initial={{ opacity: 0, scale: 0.95, y: 30 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ 
								duration: 1, 
								ease: [0.22, 1, 0.36, 1],
							}}
							onAnimationComplete={() => {
								if (isRevealing) {
									onRevealComplete();
								}
							}}
						>
							{/* Invitation card */}
							<motion.div 
								className="w-full max-w-lg bg-wedding-card-bg rounded-xl shadow-2xl border border-wedding-border overflow-hidden"
								initial={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
								animate={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
								transition={{ delay: 0.5, duration: 1 }}
							>
								<InvitationContent
									isRevealing={showInvitation}
									onRevealComplete={() => {}}
								/>
							</motion.div>

							{/* Reset button */}
							{hasOpened && isComplete && (
								<motion.div
									className="text-center mt-10"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.5, duration: 0.5 }}
								>
									<button
										type="button"
										onClick={resetAnimation}
										className="font-serif text-sm text-wedding-burgundy/40 hover:text-wedding-burgundy/70 transition-colors duration-300"
									>
										<span className="border-b border-wedding-burgundy/20 hover:border-wedding-burgundy/40 pb-0.5">
											Replay animation
										</span>
									</button>
								</motion.div>
							)}
						</motion.div>
					</InvitationBackground>
				)}
			</AnimatePresence>
		</>
	);
}

export { FloralCorner, FloralDivider } from "./floral-decorations";
export { InvitationBackground } from "./invitation-background";
export { InvitationCard } from "./invitation-card";
export { InvitationContent } from "./invitation-content";
export { RsvpForm } from "./rsvp-form";
export { WaxSeal } from "./wax-seal";
