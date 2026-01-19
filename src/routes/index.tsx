import { Gallery } from "@/src/components/gallery";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { UploadButton } from "@/src/components/upload-button";
import { useImageDelete } from "@/src/hooks/use-image-delete";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { fetchImages } from "@/src/lib/api/images";
import { QUERY_KEYS, STORAGE_KEYS } from "@/src/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { handleDelete } = useImageDelete();
	const {
		uploadingImages,
		handleUploadBegin,
		handleUploadError,
		handleUploadComplete,
	} = useImageUpload();

	const {
		data: images = [],
		isLoading,
		isFetching,
		error,
	} = useQuery({
		queryKey: QUERY_KEYS.IMAGES,
		queryFn: fetchImages,
		placeholderData: (previousData) => previousData,
	});

	// Persist image count to localStorage for skeleton loading
	useEffect(() => {
		if (images.length > 0 && !isLoading) {
			try {
				localStorage.setItem(
					STORAGE_KEYS.GALLERY_IMAGE_COUNT,
					String(images.length),
				);
			} catch {
				// Ignore localStorage errors
			}
		}
	}, [images.length, isLoading]);

	return (
		<div className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="size-8 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300" />
							<div>
								<h1 className="text-lg font-semibold tracking-tight">
									Wedding Gallery
								</h1>
								<p className="text-xs text-neutral-500 dark:text-neutral-400">
									{isLoading
										? "Loading..."
										: `${images.length} photo${images.length !== 1 ? "s" : ""}`}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<UploadButton
								onUploadComplete={handleUploadComplete}
								onUploadError={handleUploadError}
								onUploadBegin={handleUploadBegin}
							/>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12">
				{error && (
					<div className="mb-8 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 p-4">
						<p className="text-sm text-red-800 dark:text-red-200">
							Error loading images: {error.message}
						</p>
					</div>
				)}
				<Gallery
					images={images}
					isLoading={isLoading}
					isFetching={isFetching}
					uploadingImages={uploadingImages}
					onDelete={handleDelete}
				/>
			</main>
		</div>
	);
}
