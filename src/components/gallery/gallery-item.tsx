import { useState } from "react";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/utils";
import type { GalleryImage } from "@/src/types/gallery";
import { ImageViewer } from "./image-viewer";

interface GalleryItemProps {
	image: GalleryImage;
	imageIndex: number;
	allImages: GalleryImage[];
	isSelected?: boolean;
	onSelect?: (key: string, selected: boolean) => void;
	onDelete?: (keys: string[]) => void;
	selectionMode?: boolean;
}

export function GalleryItem({
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

	const handleOpenViewer = () => {
		if (!selectionMode) {
			setIsDialogOpen(true);
		}
	};

	return (
		<>
			<button
				type="button"
				data-slot="card"
				className={cn(
					"bg-card text-card-foreground rounded-xl border shadow-sm text-left",
					"relative overflow-hidden group transition-all border-neutral-200 dark:border-neutral-800 p-0",
					"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
					selectionMode
						? "cursor-pointer"
						: "cursor-pointer hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700",
					isSelected &&
						"ring-2 ring-neutral-900 dark:ring-neutral-100 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950",
				)}
				onClick={selectionMode ? handleCardClick : handleOpenViewer}
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
			</button>
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
