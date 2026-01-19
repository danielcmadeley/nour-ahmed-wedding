import { useId, useMemo } from "react";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

interface GallerySkeletonProps {
	count: number;
}

export function GallerySkeleton({ count }: GallerySkeletonProps) {
	const baseId = useId();
	const skeletonKeys = useMemo(
		() => Array.from({ length: count }, (_, i) => `${baseId}-skeleton-${i}`),
		[baseId, count],
	);

	if (count === 0) return null;

	return (
		<>
			{skeletonKeys.map((key) => (
				<div
					key={key}
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
