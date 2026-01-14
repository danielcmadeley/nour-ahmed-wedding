import type { GalleryImage } from "@/src/types/gallery";

export async function fetchImages(): Promise<GalleryImage[]> {
	const response = await fetch("/api/images");

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage =
			errorData.details ||
			errorData.error ||
			`HTTP ${response.status}: Failed to fetch images`;
		throw new Error(errorMessage);
	}

	return response.json();
}

export async function deleteImages(keys: string[]): Promise<void> {
	const response = await fetch("/api/images", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ keys }),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage =
			errorData.details ||
			errorData.error ||
			`HTTP ${response.status}: Failed to delete images`;
		throw new Error(errorMessage);
	}
}

// Convenience function for single image deletion
export async function deleteImage(key: string): Promise<void> {
	return deleteImages([key]);
}
