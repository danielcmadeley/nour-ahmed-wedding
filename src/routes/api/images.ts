import { createFileRoute } from "@tanstack/react-router";
import { UTApi } from "uploadthing/server";

function getUploadThingToken(): string | null {
	return (
		process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET || null
	);
}

function buildFileUrl(key: string, appId?: string): string {
	if (appId) {
		return `https://${appId}.ufs.sh/f/${key}`;
	}
	// Fallback to legacy URL pattern (deprecated but still supported)
	return `https://utfs.io/f/${key}`;
}

export const Route = createFileRoute("/api/images")({
	server: {
		handlers: {
			DELETE: async ({ request }) => {
				try {
					const token = getUploadThingToken();

					if (!token) {
						return Response.json(
							{
								error: "UploadThing token not configured",
								details:
									"Please set UPLOADTHING_TOKEN or UPLOADTHING_SECRET in your .env file",
							},
							{ status: 500 },
						);
					}

					const body = await request.json().catch(() => ({}));
					const { keys } = body;

					if (!keys || !Array.isArray(keys) || keys.length === 0) {
						return Response.json(
							{
								error: "Invalid request",
								details: "Array of file keys is required",
							},
							{ status: 400 },
						);
					}

					// Validate all keys are strings
					if (!keys.every((key: unknown) => typeof key === "string")) {
						return Response.json(
							{ error: "Invalid request", details: "All keys must be strings" },
							{ status: 400 },
						);
					}

					const utapi = new UTApi({ token });
					await utapi.deleteFiles(keys);

					return Response.json({ success: true });
				} catch (error) {
					console.error("Error deleting image:", error);

					const errorMessage =
						error instanceof Error ? error.message : String(error);

					return Response.json(
						{
							error: "Failed to delete image",
							details: errorMessage,
						},
						{ status: 500 },
					);
				}
			},
			GET: async () => {
				try {
					const token = getUploadThingToken();

					if (!token) {
						return Response.json(
							{
								error: "UploadThing token not configured",
								details:
									"Please set UPLOADTHING_TOKEN or UPLOADTHING_SECRET in your .env file",
							},
							{ status: 500 },
						);
					}

					const utapi = new UTApi({ token });
					const result = await utapi.listFiles();
					const appId = process.env.UPLOADTHING_APP_ID;

					const images = result.files.map((file) => ({
						key: file.key,
						id: file.id,
						name: file.name || file.key,
						url: buildFileUrl(file.key, appId),
						size: file.size || 0,
					}));

					return Response.json(images);
				} catch (error) {
					console.error("Error fetching images:", error);

					const errorMessage =
						error instanceof Error ? error.message : String(error);
					const errorStack = error instanceof Error ? error.stack : undefined;

					return Response.json(
						{
							error: "Failed to fetch images",
							details: errorMessage,
							...(process.env.NODE_ENV === "development" && {
								stack: errorStack,
							}),
						},
						{ status: 500 },
					);
				}
			},
		},
	},
});
