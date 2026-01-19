import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useUploadThing } from "@/src/lib/uploadthing";

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
	const [isUploading, setIsUploading] = useState(false);

	const { startUpload } = useUploadThing("imageUploader", {
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
			onUploadError?.(error);
		},
		onUploadBegin: (fileName) => {
			setIsUploading(true);
			onUploadBegin?.(fileName);
		},
	});

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = Array.from(event.target.files || []);
		if (files.length > 0) {
			await startUpload(files);
		}
	};

	return (
		<Button
			variant="default"
			size="sm"
			className={className}
			disabled={isUploading}
			asChild
		>
			<label className="cursor-pointer">
				<UploadIcon className="size-4" />
				{isUploading ? "Uploading..." : "Upload Photos"}
				<input
					type="file"
					accept="image/*"
					multiple
					className="hidden"
					onChange={handleFileChange}
					disabled={isUploading}
				/>
			</label>
		</Button>
	);
}
