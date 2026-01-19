import { z } from "zod";

export const rsvpSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name is too long"),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	attending: z.boolean(),
	numberOfGuests: z.number().min(1).max(5).default(1),
	dietaryRestrictions: z.string().max(500).optional().or(z.literal("")),
	message: z.string().max(1000).optional().or(z.literal("")),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;

export interface RsvpEntry extends RsvpFormData {
	id: string;
	createdAt: string;
}

export interface RsvpResponse {
	guests: RsvpEntry[];
}
