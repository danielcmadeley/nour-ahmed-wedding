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
 * Uses a direct download approach that works on mobile browsers
 */
export async function downloadImage(url: string, filename: string) {
	try {
		// For mobile devices, we need a different approach
		// The most reliable way is to open the image in a new tab and let the user long-press to save
		// Or use a direct download with proper CORS handling

		const response = await fetch(url, {
			mode: 'cors',
			credentials: 'omit'
		});
		if (!response.ok) throw new Error("Failed to fetch image");

		const blob = await response.blob();

		// Create object URL
		const blobUrl = URL.createObjectURL(blob);

		// Create a temporary anchor element
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = filename;

		// For mobile browsers, we need to ensure the download attribute works
		link.setAttribute('download', filename);
		link.style.display = 'none';

		document.body.appendChild(link);

		// Trigger download
		link.click();

		// Cleanup
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		}, 100);
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	}
}

/**
 * Downloads multiple images
 * On mobile: Downloads each image individually (no ZIP) so they save to gallery
 * On desktop: Creates a ZIP file
 */
export async function downloadImagesAsZip(
	images: Array<{ url: string; name: string }>,
	zipFilename = "images.zip",
) {
	try {
		// On mobile devices, download each image individually
		// This allows them to be saved to the photo gallery
		if (isMobileDevice()) {
			// Download each image with a small delay between downloads
			for (let i = 0; i < images.length; i++) {
				const image = images[i];
				await downloadImage(image.url, image.name);

				// Add a small delay between downloads to avoid overwhelming the browser
				if (i < images.length - 1) {
					await new Promise(resolve => setTimeout(resolve, 300));
				}
			}
			return;
		}

		// Desktop: Create ZIP file
		const zip = new JSZip();
		const imageFolder = zip.folder("images");

		if (!imageFolder) throw new Error("Failed to create ZIP folder");

		// Fetch all images and add them to the ZIP
		await Promise.all(
			images.map(async (image, index) => {
				try {
					const response = await fetch(image.url, {
						mode: 'cors',
						credentials: 'omit'
					});
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
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();

		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);
		}, 100);
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
