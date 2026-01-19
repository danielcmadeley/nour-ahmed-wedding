import { Link } from "@tanstack/react-router";
import { Calendar, Camera, Clock, MapPin, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { WEDDING_DETAILS } from "@/src/lib/constants";
import { FloralDivider } from "./floral-decorations";
import { RsvpForm } from "./rsvp-form";

interface InvitationContentProps {
	isRevealing: boolean;
	onRevealComplete: () => void;
}

export function InvitationContent({
	isRevealing,
	onRevealComplete,
}: InvitationContentProps) {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.12,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			className="text-center py-4"
			variants={containerVariants}
			initial="hidden"
			animate={isRevealing ? "visible" : "hidden"}
			onAnimationComplete={(definition) => {
				if (definition === "visible" && isRevealing) {
					onRevealComplete();
				}
			}}
		>
			{/* Header text */}
			<motion.p
				variants={itemVariants}
				className="font-serif text-wedding-burgundy/80 text-sm sm:text-base tracking-widest uppercase"
			>
				Together with their families
			</motion.p>

			{/* Couple names */}
			<motion.div variants={itemVariants} className="my-8">
				<h1 className="font-script text-5xl sm:text-7xl text-wedding-burgundy">
					{WEDDING_DETAILS.bride}
				</h1>
				<p className="font-serif text-wedding-gold text-2xl my-2">&</p>
				<h1 className="font-script text-5xl sm:text-7xl text-wedding-burgundy">
					{WEDDING_DETAILS.groom}
				</h1>
			</motion.div>

			<motion.div variants={itemVariants}>
				<FloralDivider className="my-6" />
			</motion.div>

			{/* Invitation text */}
			<motion.p
				variants={itemVariants}
				className="font-serif text-wedding-burgundy/80 text-lg sm:text-xl"
			>
				Request the pleasure of your company
				<br />
				at the celebration of their marriage
			</motion.p>

			<motion.div variants={itemVariants}>
				<FloralDivider className="my-6" />
			</motion.div>

			{/* Wedding details */}
			<motion.div variants={itemVariants} className="space-y-4 my-8">
				{/* Date */}
				<div className="flex items-center justify-center gap-3 text-wedding-burgundy">
					<Calendar className="w-5 h-5 text-wedding-gold" />
					<span className="font-serif text-lg sm:text-xl">
						{WEDDING_DETAILS.date}
					</span>
				</div>

				{/* Time */}
				<div className="flex items-center justify-center gap-3 text-wedding-burgundy">
					<Clock className="w-5 h-5 text-wedding-gold" />
					<span className="font-serif text-lg sm:text-xl">
						{WEDDING_DETAILS.time}
					</span>
				</div>

				{/* Venue */}
				<div className="flex items-center justify-center gap-3 text-wedding-burgundy">
					<MapPin className="w-5 h-5 text-wedding-gold" />
					<div className="font-serif text-lg sm:text-xl">
						<p>{WEDDING_DETAILS.venue.name}</p>
						<p className="text-base text-wedding-burgundy/70">
							{WEDDING_DETAILS.venue.address}
						</p>
						<p className="text-base text-wedding-burgundy/70">
							{WEDDING_DETAILS.venue.city}
						</p>
					</div>
				</div>

				{/* Dress code */}
				<div className="flex items-center justify-center gap-3 text-wedding-burgundy">
					<Shirt className="w-5 h-5 text-wedding-gold" />
					<span className="font-serif text-lg sm:text-xl">
						{WEDDING_DETAILS.dressCode}
					</span>
				</div>
			</motion.div>

			<motion.div variants={itemVariants}>
				<FloralDivider className="my-6" />
			</motion.div>

			{/* RSVP Section */}
			<motion.div variants={itemVariants} className="mt-8">
				<p className="font-serif text-wedding-burgundy/80 text-sm mb-2">
					Kindly respond by {WEDDING_DETAILS.rsvpDeadline}
				</p>
				<RsvpForm />
			</motion.div>

			<motion.div variants={itemVariants}>
				<FloralDivider className="my-8" />
			</motion.div>

			{/* Gallery link */}
			<motion.div variants={itemVariants}>
				<Link
					to="/gallery"
					className="inline-flex items-center gap-2 px-6 py-3 bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-burgundy font-serif rounded-full transition-colors border border-wedding-gold/30"
				>
					<Camera className="w-5 h-5" />
					<span>View Photo Gallery</span>
				</Link>
			</motion.div>
		</motion.div>
	);
}
