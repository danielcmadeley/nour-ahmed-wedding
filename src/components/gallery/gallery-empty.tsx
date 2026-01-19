import { ImageIcon } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/src/components/ui/empty";
import { cn } from "@/src/lib/utils";

interface GalleryEmptyProps {
	className?: string;
}

export function GalleryEmpty({ className }: GalleryEmptyProps) {
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
