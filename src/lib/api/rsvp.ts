import type { RsvpEntry, RsvpFormData, RsvpResponse } from "@/src/types/rsvp";

export async function submitRsvp(data: RsvpFormData): Promise<RsvpEntry> {
	const response = await fetch("/api/rsvp", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ message: "Failed to submit RSVP" }));
		throw new Error(error.message || "Failed to submit RSVP");
	}

	return response.json();
}

export async function fetchRsvpList(): Promise<RsvpResponse> {
	const response = await fetch("/api/rsvp");

	if (!response.ok) {
		throw new Error("Failed to fetch RSVP list");
	}

	return response.json();
}
