import JSZip from "jszip";

/**
 * Downloads a single image from a URL
 */
export async function downloadImage(url: string, filename: string) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Failed to fetch image");

		const blob = await response.blob();
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
 * Downloads multiple images as a ZIP file
 */
export async function downloadImagesAsZip(
	images: Array<{ url: string; name: string }>,
	zipFilename = "images.zip",
) {
	try {
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
		console.error("ZIP download failed:", error);
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
