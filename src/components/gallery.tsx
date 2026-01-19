import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ImageIcon,
	Trash2Icon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/src/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/src/components/ui/empty";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Spinner } from "@/src/components/ui/spinner";
import { STORAGE_KEYS } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";
import { formatFileSizeMB } from "@/src/lib/utils/format";
import type { GalleryImage } from "@/src/types/gallery";

const dialogFullscreenStyle: React.CSSProperties = {
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

interface GalleryProps {
	images: GalleryImage[];
	isLoading?: boolean;
	isFetching?: boolean; // True when refetching (including after upload)
	uploadingImages?: string[]; // Array of file names being uploaded
	onDelete?: (keys: string[]) => void;
	className?: string;
}

interface GalleryItemProps {
	image: GalleryImage;
	imageIndex: number;
	allImages: GalleryImage[];
	isSelected?: boolean;
	onSelect?: (key: string, selected: boolean) => void;
	onDelete?: (keys: string[]) => void;
	selectionMode?: boolean;
}

interface ImageViewerProps {
	images: GalleryImage[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
	onDelete?: (keys: string[]) => void;
}

function ImageViewer({
	images,
	initialIndex,
	isOpen,
	onClose,
	onDelete,
}: ImageViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);
	const minSwipeDistance = 50;

	const currentImage = images[currentIndex];

	// Update index when initialIndex changes (when opening from different images)
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
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			goToNext();
		} else if (isRightSwipe) {
			goToPrevious();
		}

		touchStartX.current = null;
		touchEndX.current = null;
	};

	if (!currentImage) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="fixed inset-0 top-0 left-0 right-0 bottom-0 translate-x-0 translate-y-0 max-w-none w-screen h-screen max-h-screen p-0 m-0 rounded-none border-0"
				style={dialogFullscreenStyle}
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
							{onDelete && (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="destructive"
											size="sm"
											onClick={(e) => e.stopPropagation()}
											className="ml-4"
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
												onClick={() => {
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
												}}
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
			</DialogContent>
		</Dialog>
	);
}

function GalleryItem({
	image,
	imageIndex,
	allImages,
	isSelected = false,
	onSelect,
	onDelete,
	selectionMode = false,
}: GalleryItemProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleCardClick = (e: React.MouseEvent) => {
		if (selectionMode && onSelect) {
			e.preventDefault();
			onSelect(image.key, !isSelected);
		}
	};

	return (
		<>
			<div
				data-slot="card"
				className={cn(
					"bg-card text-card-foreground rounded-xl border shadow-sm",
					"relative overflow-hidden group transition-all border-neutral-200 dark:border-neutral-800 p-0",
					selectionMode
						? "cursor-pointer"
						: "cursor-pointer hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700",
					isSelected &&
						"ring-2 ring-neutral-900 dark:ring-neutral-100 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950",
				)}
				onClick={selectionMode ? handleCardClick : () => setIsDialogOpen(true)}
			>
				{selectionMode && (
					<div className="absolute top-2 left-2 z-10">
						<Checkbox
							checked={isSelected}
							onCheckedChange={(checked) => {
								if (onSelect) {
									onSelect(image.key, checked === true);
								}
							}}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				)}
				<CardContent className="p-0">
					<AspectRatio
						ratio={1}
						className="overflow-hidden bg-neutral-100 dark:bg-neutral-900"
					>
						<img
							src={image.url}
							alt={image.name}
							className={cn(
								"w-full h-full object-cover transition-transform duration-300",
								!selectionMode && "group-hover:scale-105",
								isSelected && "opacity-75",
							)}
							loading="lazy"
						/>
					</AspectRatio>
				</CardContent>
			</div>
			<ImageViewer
				images={allImages}
				initialIndex={imageIndex}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onDelete={onDelete && !selectionMode ? onDelete : undefined}
			/>
		</>
	);
}

function GallerySkeleton({ count }: { count: number }) {
	if (count === 0) return null;

	return (
		<>
			{Array.from({ length: count }, (_, index) => (
				<div
					key={`skeleton-${index}`}
					data-slot="card"
					className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden border-neutral-200 dark:border-neutral-800 p-0"
				>
					<CardContent className="p-0">
						<AspectRatio
							ratio={1}
							className="bg-neutral-100 dark:bg-neutral-900"
						>
							<Skeleton className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
						</AspectRatio>
					</CardContent>
				</div>
			))}
		</>
	);
}

function UploadingImagePlaceholder({ fileName }: { fileName: string }) {
	return (
		<div
			data-slot="card"
			className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden border-dashed border-neutral-300 dark:border-neutral-700 p-0"
		>
			<CardContent className="p-0">
				<AspectRatio
					ratio={1}
					className="relative bg-neutral-100 dark:bg-neutral-900"
				>
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-50/80 dark:bg-neutral-950/80">
						<Spinner className="size-8 text-neutral-600 dark:text-neutral-400" />
						<p className="text-xs text-neutral-600 dark:text-neutral-400 text-center px-2 truncate w-full">
							{fileName}
						</p>
					</div>
				</AspectRatio>
			</CardContent>
		</div>
	);
}

export function Gallery({
	images,
	isLoading,
	isFetching = false,
	uploadingImages = [],
	onDelete,
	className,
}: GalleryProps) {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [selectionMode, setSelectionMode] = useState(false);
	const isLoadingOrFetching = isLoading || isFetching;
	const hasContent = images.length > 0 || uploadingImages.length > 0;
	// Only show empty state if we have no content AND we're not loading/fetching AND not uploading
	const shouldShowEmpty =
		!hasContent && !isLoadingOrFetching && uploadingImages.length === 0;

	// Get expected skeleton count from localStorage
	const expectedImageCount = useMemo(() => {
		if (typeof window === "undefined") return 0;
		try {
			const stored = localStorage.getItem(STORAGE_KEYS.GALLERY_IMAGE_COUNT);
			return stored ? Number.parseInt(stored, 10) : 0;
		} catch (_e) {
			return 0;
		}
	}, []);

	const handleSelect = (key: string, selected: boolean) => {
		setSelectedKeys((prev) => {
			const next = new Set(prev);
			if (selected) {
				next.add(key);
			} else {
				next.delete(key);
			}
			return next;
		});
	};

	const handleDeleteSelected = () => {
		if (selectedKeys.size > 0 && onDelete) {
			onDelete(Array.from(selectedKeys));
			setSelectedKeys(new Set());
			setSelectionMode(false);
		}
	};

	const toggleSelectionMode = () => {
		setSelectionMode((prev) => !prev);
		if (selectionMode) {
			setSelectedKeys(new Set());
		}
	};

	// Only show empty state if we truly have no content and aren't loading/fetching/uploading
	if (shouldShowEmpty) {
		return (
			<Empty className={className}>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ImageIcon className="text-neutral-400 dark:text-neutral-600" />
					</EmptyMedia>
					<EmptyTitle className="text-neutral-900 dark:text-neutral-100">
						No images yet
					</EmptyTitle>
					<EmptyDescription className="text-neutral-600 dark:text-neutral-400">
						Upload your first image to see it appear in the gallery.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className={cn("space-y-6", className)}>
			{hasContent && (
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-2">
						{selectionMode && (
							<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								{selectedKeys.size} selected
							</span>
						)}
					</div>
					<div className="flex items-center gap-2">
						{selectionMode && selectedKeys.size > 0 && onDelete && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash2Icon />
										Delete ({selectedKeys.size})
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Images</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete {selectedKeys.size} image
											{selectedKeys.size !== 1 ? "s" : ""}? This action cannot
											be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDeleteSelected}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
						<Button
							variant={selectionMode ? "default" : "outline"}
							size="sm"
							onClick={toggleSelectionMode}
						>
							{selectionMode ? "Cancel" : "Select"}
						</Button>
					</div>
				</div>
			)}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
				{uploadingImages.map((fileName, index) => (
					<UploadingImagePlaceholder
						key={`uploading-${index}-${fileName}`}
						fileName={fileName}
					/>
				))}
				{isLoading && expectedImageCount > 0 ? (
					<GallerySkeleton count={expectedImageCount} />
				) : (
					images.map((image, index) => (
						<GalleryItem
							key={image.key}
							image={image}
							imageIndex={index}
							allImages={images}
							isSelected={selectedKeys.has(image.key)}
							onSelect={handleSelect}
							onDelete={onDelete}
							selectionMode={selectionMode}
						/>
					))
				)}
			</div>
		</div>
	);
}
