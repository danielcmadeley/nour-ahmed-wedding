import { useMemo } from "react";
import { useGallerySelection } from "@/src/hooks/use-gallery-selection";
import { STORAGE_KEYS } from "@/src/lib/constants";
import { cn } from "@/src/lib/utils";
import type { GalleryImage } from "@/src/types/gallery";
import { GalleryEmpty } from "./gallery-empty";
import { GalleryItem } from "./gallery-item";
import { GallerySkeleton } from "./gallery-skeleton";
import { GalleryToolbar } from "./gallery-toolbar";
import { UploadingImagePlaceholder } from "./uploading-image-placeholder";

interface GalleryProps {
	images: GalleryImage[];
	isLoading?: boolean;
	isFetching?: boolean;
	uploadingImages?: string[];
	onDelete?: (keys: string[]) => void;
	className?: string;
}

export function Gallery({
	images,
	isLoading,
	isFetching = false,
	uploadingImages = [],
	onDelete,
	className,
}: GalleryProps) {
	const {
		selectedKeys,
		selectionMode,
		handleSelect,
		clearSelection,
		toggleSelectionMode,
	} = useGallerySelection();

	const isLoadingOrFetching = isLoading || isFetching;
	const hasContent = images.length > 0 || uploadingImages.length > 0;
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

	const handleDeleteSelected = () => {
		if (selectedKeys.size > 0 && onDelete) {
			onDelete(Array.from(selectedKeys));
			clearSelection();
		}
	};

	if (shouldShowEmpty) {
		return <GalleryEmpty className={className} />;
	}

	return (
		<div className={cn("space-y-6", className)}>
			{hasContent && (
				<GalleryToolbar
					selectedKeys={selectedKeys}
					images={images}
					selectionMode={selectionMode}
					onToggleSelectionMode={toggleSelectionMode}
					onDeleteSelected={handleDeleteSelected}
				/>
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
