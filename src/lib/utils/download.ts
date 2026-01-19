import JSZip from "jszip";

/**
 * Detects if the device is mobile
 */
function isMobileDevice(): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
	);
}

/**
 * Downloads a single image from a URL
 * On mobile, uses Web Share API to allow saving to photo gallery
 * On desktop, uses traditional download
 */
export async function downloadImage(url: string, filename: string) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Failed to fetch image");

		const blob = await response.blob();

		// On mobile devices, try to use the Web Share API
		if (isMobileDevice() && navigator.share && navigator.canShare) {
			// Create a File object from the blob
			const file = new File([blob], filename, { type: blob.type });

			// Check if we can share files
			if (navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({
						files: [file],
						title: "Save Image",
						text: "Save this image to your photos",
					});
					return; // Successfully shared/saved
				} catch (shareError) {
					// User cancelled share or error occurred
					// Fall through to traditional download
					console.log("Share cancelled or failed, using download fallback");
				}
			}
		}

		// Fallback: Traditional download method (desktop or if share fails)
		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up the blob URL
		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	}
}

/**
 * Downloads multiple images as a ZIP file or shares them individually on mobile
 */
export async function downloadImagesAsZip(
	images: Array<{ url: string; name: string }>,
	zipFilename = "images.zip",
) {
	try {
		// On mobile, try to share images using Web Share API
		if (isMobileDevice() && navigator.share && navigator.canShare) {
			// Fetch all images and create File objects
			const files = await Promise.all(
				images.map(async (image) => {
					const response = await fetch(image.url);
					if (!response.ok) throw new Error(`Failed to fetch ${image.name}`);
					const blob = await response.blob();
					return new File([blob], image.name, { type: blob.type });
				}),
			);

			// Try to share all files at once
			if (navigator.canShare({ files })) {
				try {
					await navigator.share({
						files,
						title: "Save Images",
						text: `Save ${files.length} images to your photos`,
					});
					return; // Successfully shared
				} catch (shareError) {
					// User cancelled or error occurred, fall through to ZIP download
					console.log("Share cancelled or failed, using ZIP fallback");
				}
			}
		}

		// Desktop or fallback: Create ZIP file
		const zip = new JSZip();
		const imageFolder = zip.folder("images");

		if (!imageFolder) throw new Error("Failed to create ZIP folder");

		// Fetch all images and add them to the ZIP
		await Promise.all(
			images.map(async (image, index) => {
				try {
					const response = await fetch(image.url);
					if (!response.ok) throw new Error(`Failed to fetch ${image.name}`);

					const blob = await response.blob();
					// Use original name or fallback to index-based naming
					const filename = image.name || `image-${index + 1}.jpg`;
					imageFolder.file(filename, blob);
				} catch (error) {
					console.error(`Failed to add ${image.name} to ZIP:`, error);
					// Continue with other images even if one fails
				}
			}),
		);

		// Generate the ZIP file
		const content = await zip.generateAsync({ type: "blob" });

		// Trigger download
		const blobUrl = URL.createObjectURL(content);
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = zipFilename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up
		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	}
}

/**
 * Generates a filename from a URL
 */
export function getFilenameFromUrl(url: string): string {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		const filename = pathname.split("/").pop() || "image.jpg";
		return filename;
	} catch {
		return "image.jpg";
	}
}
