import { useCallback } from "react";
import { useDropzone } from "@uploadthing/react";
import {
	generateClientDropzoneAccept,
	generatePermittedFileTypes,
} from "uploadthing/client";
import { Spinner } from "@/src/components/ui/spinner";
import { useUploadThing } from "@/src/lib/uploadthing";
import { ImagePlusIcon, UploadCloudIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface UploadButtonProps {
	onUploadComplete?: (
		files: { name: string; url: string; key: string }[],
	) => void;
	onUploadError?: (error: Error) => void;
	onUploadBegin?: (fileName: string) => void;
	className?: string;
}

export function UploadButton({
	onUploadComplete,
	onUploadError,
	onUploadBegin,
	className,
}: UploadButtonProps) {
	const { startUpload, isUploading, routeConfig } = useUploadThing(
		"imageUploader",
		{
			onClientUploadComplete: (res) => {
				if (onUploadComplete && res) {
					onUploadComplete(
						res.map((file) => ({
							name: file.name,
							url: file.ufsUrl,
							key: file.key,
						})),
					);
				}
			},
			onUploadError: (error) => {
				if (onUploadError) {
					onUploadError(error);
				}
			},
			onUploadBegin: (fileName) => {
				if (onUploadBegin) {
					onUploadBegin(fileName);
				}
			},
		},
	);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			// Auto-upload when files are selected
			if (acceptedFiles.length > 0) {
				startUpload(acceptedFiles);
			}
		},
		[startUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: routeConfig
			? generateClientDropzoneAccept(
					generatePermittedFileTypes(routeConfig).fileTypes,
				)
			: { "image/*": [] },
	});

	return (
		<div
			{...getRootProps()}
			className={cn(
				"flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
				isDragActive
					? "border-primary bg-primary/5"
					: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
				isUploading && "opacity-50 pointer-events-none",
				className,
			)}
		>
			{/* Explicitly set accept="image/*" to trigger native mobile image picker */}
			<input {...getInputProps()} accept="image/*" />
			{isUploading ? (
				<>
					<Spinner className="size-8 text-primary" />
					<p className="text-sm text-muted-foreground">Uploading...</p>
				</>
			) : isDragActive ? (
				<>
					<UploadCloudIcon className="size-8 text-primary" />
					<p className="text-sm text-primary font-medium">Drop images here</p>
				</>
			) : (
				<>
					<ImagePlusIcon className="size-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						<span className="font-medium text-primary">Click to upload</span> or
						drag and drop
					</p>
					<p className="text-xs text-muted-foreground">Images up to 4MB</p>
				</>
			)}
		</div>
	);
}
