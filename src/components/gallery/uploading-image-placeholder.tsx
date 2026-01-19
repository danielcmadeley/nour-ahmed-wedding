import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { CardContent } from "@/src/components/ui/card";
import { Spinner } from "@/src/components/ui/spinner";

interface UploadingImagePlaceholderProps {
	fileName: string;
}

export function UploadingImagePlaceholder({
	fileName,
}: UploadingImagePlaceholderProps) {
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
