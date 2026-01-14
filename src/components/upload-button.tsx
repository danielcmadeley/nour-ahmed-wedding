import { UploadDropzone } from "@/src/lib/uploadthing";

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
	return (
		<UploadDropzone
			endpoint="imageUploader"
			onClientUploadComplete={(res) => {
				if (onUploadComplete && res) {
					onUploadComplete(
						res.map((file) => ({
							name: file.name,
							url: file.ufsUrl,
							key: file.key,
						})),
					);
				}
			}}
			onUploadError={(error) => {
				onUploadError?.(error);
			}}
			onUploadBegin={(fileName) => {
				onUploadBegin?.(fileName);
			}}
			className={className}
		/>
	);
}
