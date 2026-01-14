/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format file size in bytes to MB
 */
export function formatFileSizeMB(bytes: number): string {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
