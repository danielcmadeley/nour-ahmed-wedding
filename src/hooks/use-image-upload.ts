import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/src/lib/constants";

export function useImageUpload() {
	const queryClient = useQueryClient();
	const [uploadingImages, setUploadingImages] = useState<string[]>([]);

	const handleUploadBegin = useCallback((name: string) => {
		setUploadingImages((prev) => [...prev, name]);
		toast.loading(`Uploading ${name}...`, {
			id: `upload-${name}`,
		});
	}, []);

	const handleUploadError = useCallback((error: Error) => {
		setUploadingImages((prev) => prev.slice(1));
		toast.dismiss();
		toast.error("Failed to upload image", {
			description: error.message,
		});
	}, []);

	const handleUploadComplete = useCallback(
		(uploaded: Array<{ name: string; url: string; key: string }>) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IMAGES });
			const fileCount = uploaded.length;
			const fileNames = uploaded.map((file) => file.name);

			setUploadingImages((prev) =>
				prev.filter((name) => !fileNames.includes(name)),
			);

			for (const name of fileNames) {
				toast.dismiss(`upload-${name}`);
			}

			toast.success(
				fileCount === 1
					? "Image uploaded successfully"
					: `${fileCount} images uploaded successfully`,
			);
		},
		[queryClient],
	);

	return {
		uploadingImages,
		handleUploadBegin,
		handleUploadError,
		handleUploadComplete,
	};
}
