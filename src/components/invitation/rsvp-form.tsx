import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { submitRsvp } from "@/src/lib/api/rsvp";
import { type RsvpFormData, rsvpSchema } from "@/src/types/rsvp";

export function RsvpForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RsvpFormData>({
		resolver: zodResolver(rsvpSchema),
		defaultValues: {
			name: "",
			email: "",
			attending: true,
			numberOfGuests: 1,
			dietaryRestrictions: "",
			message: "",
		},
	});

	const attending = watch("attending");

	const onSubmit = async (data: RsvpFormData) => {
		setIsSubmitting(true);
		try {
			await submitRsvp(data);
			setIsSubmitted(true);
			toast.success("Thank you for your RSVP!");
		} catch (error) {
			toast.error("Failed to submit RSVP. Please try again.");
			console.error("RSVP submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="bg-wedding-sage/10 rounded-lg p-6 text-center border border-wedding-sage/30">
				<div className="inline-flex items-center justify-center w-12 h-12 bg-wedding-sage/20 rounded-full mb-4">
					<Check className="w-6 h-6 text-wedding-sage-dark" />
				</div>
				<h3 className="font-serif text-xl text-wedding-burgundy mb-2">
					Thank You!
				</h3>
				<p className="font-serif text-wedding-burgundy/70">
					Your RSVP has been received. We look forward to celebrating with you!
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 text-left bg-wedding-ivory/50 rounded-lg p-6 border border-wedding-gold/20"
		>
			<h3 className="font-script text-3xl text-wedding-burgundy text-center mb-4">
				RSVP
			</h3>

			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name" className="font-serif text-wedding-burgundy">
					Your Name *
				</Label>
				<Input
					id="name"
					{...register("name")}
					placeholder="Enter your full name"
					className="font-serif bg-wedding-card-bg border-wedding-gold/30 focus:border-wedding-gold text-wedding-text placeholder:text-wedding-text-muted"
				/>
				{errors.name && (
					<p className="text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Email */}
			<div className="space-y-2">
				<Label htmlFor="email" className="font-serif text-wedding-burgundy">
					Email (optional)
				</Label>
				<Input
					id="email"
					type="email"
					{...register("email")}
					placeholder="your@email.com"
					className="font-serif bg-wedding-card-bg border-wedding-gold/30 focus:border-wedding-gold text-wedding-text placeholder:text-wedding-text-muted"
				/>
				{errors.email && (
					<p className="text-sm text-red-500">{errors.email.message}</p>
				)}
			</div>

			{/* Attending */}
			<div className="space-y-2">
				<Label className="font-serif text-wedding-burgundy">
					Will you be attending? *
				</Label>
				<div className="flex gap-4">
					<button
						type="button"
						onClick={() => setValue("attending", true)}
						className={`flex-1 py-2 px-4 rounded-lg font-serif border transition-colors ${
							attending
								? "bg-wedding-sage/20 border-wedding-sage text-wedding-sage-dark"
								: "bg-wedding-card-bg border-wedding-gold/30 text-wedding-text-muted hover:border-wedding-gold/50"
						}`}
					>
						Joyfully Accept
					</button>
					<button
						type="button"
						onClick={() => setValue("attending", false)}
						className={`flex-1 py-2 px-4 rounded-lg font-serif border transition-colors ${
							!attending
								? "bg-wedding-rose/20 border-wedding-rose text-wedding-burgundy"
								: "bg-wedding-card-bg border-wedding-gold/30 text-wedding-text-muted hover:border-wedding-gold/50"
						}`}
					>
						Regretfully Decline
					</button>
				</div>
			</div>

			{/* Number of guests - only show if attending */}
			{attending && (
				<div className="space-y-2">
					<Label
						htmlFor="numberOfGuests"
						className="font-serif text-wedding-burgundy"
					>
						Number of Guests
					</Label>
					<Select
						defaultValue="1"
						onValueChange={(value) =>
							setValue("numberOfGuests", parseInt(value, 10))
						}
					>
						<SelectTrigger className="font-serif bg-wedding-card-bg border-wedding-gold/30 text-wedding-text">
							<SelectValue placeholder="Select number of guests" />
						</SelectTrigger>
						<SelectContent className="bg-wedding-card-bg border-wedding-border">
							{[1, 2, 3, 4, 5].map((num) => (
								<SelectItem
									key={num}
									value={num.toString()}
									className="font-serif text-wedding-text"
								>
									{num} {num === 1 ? "Guest" : "Guests"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Dietary restrictions - only show if attending */}
			{attending && (
				<div className="space-y-2">
					<Label
						htmlFor="dietaryRestrictions"
						className="font-serif text-wedding-burgundy"
					>
						Dietary Restrictions (optional)
					</Label>
					<Input
						id="dietaryRestrictions"
						{...register("dietaryRestrictions")}
						placeholder="Any allergies or dietary requirements"
						className="font-serif bg-wedding-card-bg border-wedding-gold/30 focus:border-wedding-gold text-wedding-text placeholder:text-wedding-text-muted"
					/>
				</div>
			)}

			{/* Message */}
			<div className="space-y-2">
				<Label htmlFor="message" className="font-serif text-wedding-burgundy">
					Message for the Couple (optional)
				</Label>
				<Textarea
					id="message"
					{...register("message")}
					placeholder="Share your well wishes..."
					rows={3}
					className="font-serif bg-wedding-card-bg border-wedding-gold/30 focus:border-wedding-gold resize-none text-wedding-text placeholder:text-wedding-text-muted"
				/>
			</div>

			{/* Submit button */}
			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-wedding-burgundy hover:bg-wedding-burgundy/90 text-white font-serif py-3"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						Sending...
					</>
				) : (
					<>
						<Send className="w-4 h-4 mr-2" />
						Send RSVP
					</>
				)}
			</Button>
		</form>
	);
}
