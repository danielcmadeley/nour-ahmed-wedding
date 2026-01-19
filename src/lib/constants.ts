/**
 * Application-wide constants
 */

// Local Storage Keys
export const STORAGE_KEYS = {
	GALLERY_IMAGE_COUNT: "gallery_image_count",
} as const;

// Query Keys
export const QUERY_KEYS = {
	IMAGES: ["images"],
} as const;

// Upload Configuration
export const UPLOAD_CONFIG = {
	MAX_FILE_SIZE_MB: 4,
	MAX_FILE_COUNT: 10,
} as const;
