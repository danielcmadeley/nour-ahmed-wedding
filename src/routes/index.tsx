import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Gallery } from "@/src/components/gallery";
import { UploadButton } from "@/src/lib/uploadthing";
import { deleteImages, fetchImages } from "@/src/lib/api/images";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const queryClient = useQueryClient();
	const [uploadingImages, setUploadingImages] = useState<string[]>([]);
	const IMAGES_QUERY_KEY = ["images"] as const;

	const {
		data: images = [],
		isLoading,
		isFetching,
		error,
	} = useQuery({
		queryKey: IMAGES_QUERY_KEY,
		queryFn: fetchImages,
		placeholderData: (previousData) => previousData, // Keep previous data while refetching
	});

	const deleteMutation = useMutation({
		mutationFn: deleteImages,
		onSuccess: (_, keys) => {
			queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY });
			const count = keys.length;
			toast.success(
				count === 1
					? "Image deleted successfully"
					: `${count} images deleted successfully`,
			);
		},
		onError: (error) => {
			toast.error("Failed to delete images", {
				description: error.message,
			});
		},
	});

	const handleDelete = (keys: string[]) => {
		deleteMutation.mutate(keys);
	};

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
		(uploaded) => {
			queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY });
			const fileCount = uploaded.length;
			const fileNames = uploaded.map((file: { name: string }) => file.name);

			setUploadingImages((prev) =>
				prev.filter((name) => !fileNames.includes(name)),
			);

			fileNames.forEach((name: string) => {
				toast.dismiss(`upload-${name}`);
			});

			toast.success(
				fileCount === 1
					? "Image uploaded successfully"
					: `${fileCount} images uploaded successfully`,
			);
		},
		[IMAGES_QUERY_KEY, queryClient],
	);

	return (
		<div className="p-8 space-y-8">
			<div>
				<h1 className="text-3xl font-bold mb-2">Image Gallery</h1>
				<p className="text-muted-foreground mb-6">
					Upload images to add them to your gallery
				</p>
				<UploadButton
					endpoint="imageUploader"
					onClientUploadComplete={handleUploadComplete}
					onUploadError={handleUploadError}
					onUploadBegin={handleUploadBegin}
				/>
			</div>

			<Separator />

			<div>
				<div className="flex items-center gap-3 mb-4">
					<h2 className="text-2xl font-semibold">Gallery</h2>
					<Badge variant="secondary">
						{isLoading
							? "Loading..."
							: `${images.length} image${images.length !== 1 ? "s" : ""}`}
					</Badge>
				</div>
				{error && (
					<div className="text-destructive mb-4">
						Error loading images: {error.message}
					</div>
				)}
				<Gallery
					images={images}
					isLoading={isLoading}
					isFetching={isFetching}
					uploadingImages={uploadingImages}
					onDelete={handleDelete}
				/>
			</div>
		</div>
	);
}
