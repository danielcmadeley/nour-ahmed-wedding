/**
 * Application-wide constants
 */

// Local Storage Keys
export const STORAGE_KEYS = {
	GALLERY_IMAGE_COUNT: "gallery_image_count",
	INVITATION_OPENED: "invitation_opened",
} as const;

// Query Keys
export const QUERY_KEYS = {
	IMAGES: ["images"],
	RSVP: ["rsvp"],
} as const;

// Upload Configuration
export const UPLOAD_CONFIG = {
	MAX_FILE_SIZE_MB: 4,
	MAX_FILE_COUNT: 10,
} as const;

// Wedding Details Configuration
export const WEDDING_DETAILS = {
	bride: "Nour",
	groom: "Ahmed",
	date: "Saturday, August 15th, 2026",
	time: "4:00 PM",
	venue: {
		name: "The Grand Ballroom",
		address: "123 Wedding Lane",
		city: "Cairo, Egypt",
	},
	dressCode: "Formal Attire",
	rsvpDeadline: "July 15th, 2026",
} as const;
