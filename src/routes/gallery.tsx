import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { useEffect } from "react";
import { Gallery } from "@/src/components/gallery";
import { FloralCorner } from "@/src/components/invitation/floral-decorations";
import { UploadButton } from "@/src/components/upload-button";
import { useImageDelete } from "@/src/hooks/use-image-delete";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { fetchImages } from "@/src/lib/api/images";
import { QUERY_KEYS, STORAGE_KEYS } from "@/src/lib/constants";

export const Route = createFileRoute("/gallery")({
	component: GalleryPage,
});

function GalleryPage() {
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
		<div className="min-h-screen bg-wedding-bg relative">
			{/* Background decoration */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<FloralCorner position="top-left" className="w-32 h-32 opacity-30" />
				<FloralCorner position="top-right" className="w-32 h-32 opacity-30" />
				<FloralCorner position="bottom-left" className="w-32 h-32 opacity-30" />
				<FloralCorner
					position="bottom-right"
					className="w-32 h-32 opacity-30"
				/>
			</div>

			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b border-wedding-border bg-wedding-card-bg/80 backdrop-blur-xl">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center gap-3">
							<Link
								to="/"
								className="flex items-center gap-2 text-wedding-text-muted hover:text-wedding-burgundy transition-colors font-serif"
							>
								<ArrowLeft className="size-4" />
								<span className="text-sm">Back to Invitation</span>
							</Link>
						</div>
						<div className="flex items-center gap-3 text-center">
							<Camera className="size-5 text-wedding-gold" />
							<div>
								<h1 className="font-script text-2xl text-wedding-burgundy">
									Our Memories
								</h1>
								<p className="text-xs text-wedding-text-muted font-serif">
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
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12 relative z-10">
				{error && (
					<div className="mb-8 rounded-lg border border-wedding-rose/30 bg-wedding-rose/10 p-4">
						<p className="text-sm text-wedding-burgundy font-serif">
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
