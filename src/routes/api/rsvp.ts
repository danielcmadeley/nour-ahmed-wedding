import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import {
	type RsvpEntry,
	type RsvpResponse,
	rsvpSchema,
} from "@/src/types/rsvp";

const DATA_DIR = join(process.cwd(), "data");
const RSVP_FILE = join(DATA_DIR, "rsvp.json");

async function ensureDataDir() {
	if (!existsSync(DATA_DIR)) {
		await mkdir(DATA_DIR, { recursive: true });
	}
}

async function readRsvpData(): Promise<RsvpResponse> {
	await ensureDataDir();
	try {
		const data = await readFile(RSVP_FILE, "utf-8");
		return JSON.parse(data);
	} catch {
		return { guests: [] };
	}
}

async function writeRsvpData(data: RsvpResponse): Promise<void> {
	await ensureDataDir();
	await writeFile(RSVP_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const Route = createFileRoute("/api/rsvp")({
	server: {
		handlers: {
			GET: async () => {
				const data = await readRsvpData();
				return Response.json(data);
			},
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const validated = rsvpSchema.parse(body);

					const data = await readRsvpData();

					const newEntry: RsvpEntry = {
						...validated,
						id: crypto.randomUUID(),
						createdAt: new Date().toISOString(),
					};

					data.guests.push(newEntry);
					await writeRsvpData(data);

					return Response.json(newEntry, { status: 201 });
				} catch (error) {
					console.error("RSVP submission error:", error);
					return Response.json(
						{
							message:
								error instanceof Error ? error.message : "Invalid request",
						},
						{ status: 400 },
					);
				}
			},
		},
	},
});
