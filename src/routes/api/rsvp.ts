import { createFileRoute } from "@tanstack/react-router";
import { Redis } from "@upstash/redis";
import {
	type RsvpEntry,
	type RsvpResponse,
	rsvpSchema,
} from "@/src/types/rsvp";

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

const redis = new Redis({
	url: redisUrl ?? "",
	token: redisToken ?? "",
});
const RSVP_KEY = "rsvp:guests";

async function readRsvpData(): Promise<RsvpResponse> {
	const data = await redis.get<RsvpResponse>(RSVP_KEY);
	return data ?? { guests: [] };
}

async function writeRsvpData(data: RsvpResponse): Promise<void> {
	await redis.set(RSVP_KEY, data);
}

export const Route = createFileRoute("/api/rsvp")({
	server: {
		handlers: {
			GET: async () => {
				if (!redisUrl || !redisToken) {
					return Response.json(
						{
							message: "KV_REST_API_URL and KV_REST_API_TOKEN are required",
						},
						{ status: 500 },
					);
				}

				const data = await readRsvpData();
				return Response.json(data);
			},
			POST: async ({ request }) => {
				try {
					if (!redisUrl || !redisToken) {
						return Response.json(
							{
								message: "KV_REST_API_URL and KV_REST_API_TOKEN are required",
							},
							{ status: 500 },
						);
					}

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
