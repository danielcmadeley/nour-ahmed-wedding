/**
 * Shared animation variants for motion components
 */

import type { Variants } from "motion/react";

// Staggered reveal animation for containers
export const staggerContainer: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.3,
		},
	},
};

// Fade up animation for individual items
export const fadeUpItem: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

// Fade in animation
export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.5 },
	},
};

// Scale fade animation
export const scaleFade: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, ease: "easeOut" },
	},
};
