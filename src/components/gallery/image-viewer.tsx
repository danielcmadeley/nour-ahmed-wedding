import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/src/components/ui/dialog";
import {
	downloadImage,
	getFilenameFromUrl,
} from "@/src/lib/utils/download";
import { formatFileSizeMB } from "@/src/lib/utils/format";
import type { GalleryImage } from "@/src/types/gallery";

const DIALOG_FULLSCREEN_STYLE: React.CSSProperties = {
	position: "fixed",
	inset: 0,
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	transform: "none",
	maxWidth: "none",
	width: "100vw",
	height: "100vh",
	maxHeight: "100vh",
	padding: 0,
	margin: 0,
	borderRadius: 0,
	border: "none",
};

const MIN_SWIPE_DISTANCE = 50;

interface ImageViewerProps {
	images: GalleryImage[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
	onDelete?: (keys: string[]) => void;
}

export function ImageViewer({
	images,
	initialIndex,
	isOpen,
	onClose,
	onDelete,
}: ImageViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);

	const currentImage = images[currentIndex];

	// Update index when initialIndex changes
	useEffect(() => {
		if (isOpen) {
			setCurrentIndex(initialIndex);
		}
	}, [initialIndex, isOpen]);

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	}, [images.length]);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	}, [images.length]);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				goToPrevious();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				goToNext();
			} else if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, goToPrevious, goToNext, onClose]);

	// Touch handlers for swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		if (!touchStartX.current || !touchEndX.current) return;

		const distance = touchStartX.current - touchEndX.current;
		const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
		const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

		if (isLeftSwipe) {
			goToNext();
		} else if (isRightSwipe) {
			goToPrevious();
		}

		touchStartX.current = null;
		touchEndX.current = null;
	};

	const handleDownload = async () => {
		try {
			const filename = getFilenameFromUrl(currentImage.url);
			await downloadImage(currentImage.url, filename);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	const handleDelete = () => {
		if (!onDelete) return;

		onDelete([currentImage.key]);

		// If this was the last image, close the viewer
		if (images.length === 1) {
			onClose();
		} else {
			// Navigate to next or previous image
			if (currentIndex === images.length - 1) {
				goToPrevious();
			} else {
				goToNext();
			}
		}
	};

	if (!currentImage) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="fixed inset-0 top-0 left-0 right-0 bottom-0 translate-x-0 translate-y-0 max-w-none w-screen h-screen max-h-screen p-0 m-0 rounded-none border-0"
				style={DIALOG_FULLSCREEN_STYLE}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<DialogTitle className="sr-only">{currentImage.name}</DialogTitle>
				<DialogDescription className="sr-only">
					{currentImage.size
						? `Image file: ${currentImage.name}, Size: ${formatFileSizeMB(currentImage.size)}`
						: `Image file: ${currentImage.name}`}
				</DialogDescription>
				<div className="relative w-full h-full flex items-center justify-center bg-black/95 overflow-hidden">
					{/* Navigation buttons */}
					{images.length > 1 && (
						<>
							<button
								onClick={goToPrevious}
								className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
								aria-label="Previous image"
								type="button"
							>
								<ChevronLeftIcon className="size-6" />
							</button>
							<button
								onClick={goToNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
								aria-label="Next image"
								type="button"
							>
								<ChevronRightIcon className="size-6" />
							</button>
						</>
					)}

					{/* Image counter */}
					{images.length > 1 && (
						<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
							{currentIndex + 1} / {images.length}
						</div>
					)}

					<img
						key={currentImage.key}
						src={currentImage.url}
						alt={currentImage.name}
						className="max-w-[100vw] max-h-screen w-auto h-auto object-contain transition-opacity duration-200"
						style={{
							maxWidth: "100vw",
							maxHeight: "100vh",
							width: "auto",
							height: "auto",
						}}
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 z-10">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{currentImage.name}</p>
								{currentImage.size && (
									<p className="text-sm text-white/80">
										{formatFileSizeMB(currentImage.size)}
									</p>
								)}
							</div>
							<div className="flex items-center gap-2 ml-4">
								<Button
									variant="secondary"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										handleDownload();
									}}
								>
									<DownloadIcon />
									Download
								</Button>
								{onDelete && (
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="destructive"
												size="sm"
												onClick={(e) => e.stopPropagation()}
											>
												<Trash2Icon />
												Delete
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Image</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete "{currentImage.name}"?
													This action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleDelete}
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								)}
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
