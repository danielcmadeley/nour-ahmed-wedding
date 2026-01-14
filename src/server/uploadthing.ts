import type { FileRouter } from "uploadthing/server";
import { createUploadthing, UploadThingError } from "uploadthing/server";

const f = createUploadthing();

function auth(req: Request) {
	// TODO: Replace with actual authentication logic
	return { id: "fakeId" };
}

export const uploadRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 10, // Allow multiple file uploads
		},
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);

			if (!user) {
				throw new UploadThingError("Unauthorized");
			}

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("File URL:", file.ufsUrl);

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
