import { DownloadIcon, Trash2Icon } from "lucide-react";
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
	downloadImage,
	downloadImagesAsZip,
	getFilenameFromUrl,
} from "@/src/lib/utils/download";
import type { GalleryImage } from "@/src/types/gallery";

interface GalleryToolbarProps {
	selectedKeys: Set<string>;
	images: GalleryImage[];
	selectionMode: boolean;
	onToggleSelectionMode: () => void;
	onDeleteSelected: () => void;
}

export function GalleryToolbar({
	selectedKeys,
	images,
	selectionMode,
	onToggleSelectionMode,
	onDeleteSelected,
}: GalleryToolbarProps) {
	const handleDownload = async () => {
		const selectedImages = images.filter((img) => selectedKeys.has(img.key));
		if (selectedImages.length === 0) return;

		try {
			if (selectedImages.length === 1) {
				// Single image download
				const image = selectedImages[0];
				const filename = getFilenameFromUrl(image.url);
				await downloadImage(image.url, filename);
			} else {
				// Bulk download as ZIP
				const imagesToDownload = selectedImages.map((img) => ({
					url: img.url,
					name: getFilenameFromUrl(img.url),
				}));
				await downloadImagesAsZip(imagesToDownload, "wedding-photos.zip");
			}
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-2">
				{selectionMode && (
					<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
						{selectedKeys.size} selected
					</span>
				)}
			</div>
			<div className="flex items-center gap-2">
				{selectionMode && selectedKeys.size > 0 && (
					<>
						<Button variant="secondary" size="sm" onClick={handleDownload}>
							<DownloadIcon />
							Download ({selectedKeys.size})
						</Button>
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
										{selectedKeys.size !== 1 ? "s" : ""}? This action cannot be
										undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={onDeleteSelected}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
				<Button
					variant={selectionMode ? "default" : "outline"}
					size="sm"
					onClick={onToggleSelectionMode}
				>
					{selectionMode ? "Cancel" : "Select"}
				</Button>
			</div>
		</div>
	);
}
