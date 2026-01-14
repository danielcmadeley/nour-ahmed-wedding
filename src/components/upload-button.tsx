import { useRef, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import { useUploadThing } from "@/src/lib/uploadthing";
import { ImagePlusIcon } from "lucide-react";
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
	const inputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const { startUpload, isUploading: uploadThingIsUploading } = useUploadThing(
		"imageUploader",
		{
			onClientUploadComplete: (res) => {
				setIsUploading(false);
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
				setIsUploading(false);
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

	const handleClick = () => {
		inputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);

		try {
			await startUpload(Array.from(files));
		} catch (error) {
			setIsUploading(false);
			if (onUploadError && error instanceof Error) {
				onUploadError(error);
			}
		}

		// Reset the input so the same file can be selected again
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const uploading = isUploading || uploadThingIsUploading;

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileChange}
				className="hidden"
				// capture attribute removed to allow both camera AND gallery on mobile
				// If you want camera-only, add: capture="environment"
			/>
			<Button
				onClick={handleClick}
				disabled={uploading}
				className={cn("gap-2", className)}
			>
				{uploading ? (
					<>
						<Spinner className="size-4" />
						Uploading...
					</>
				) : (
					<>
						<ImagePlusIcon className="size-4" />
						Upload Images
					</>
				)}
			</Button>
		</>
	);
}
