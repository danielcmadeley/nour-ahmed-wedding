import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/src/lib/constants";

export type AnimationPhase =
	| "sealed"
	| "breaking"
	| "opening"
	| "revealing"
	| "complete";

export function useInvitationAnimation() {
	const [phase, setPhase] = useState<AnimationPhase>("sealed");
	const [hasOpened, setHasOpened] = useState(false);

	// Check if user has already opened the invitation (just for tracking, not auto-skip)
	useEffect(() => {
		try {
			const opened = localStorage.getItem(STORAGE_KEYS.INVITATION_OPENED);
			if (opened === "true") {
				setHasOpened(true);
				// Always start sealed - user must click to open
			}
		} catch {
			// Ignore localStorage errors
		}
	}, []);

	const startAnimation = useCallback(() => {
		if (phase !== "sealed") return;
		setPhase("breaking");
	}, [phase]);

	const onSealBroken = useCallback(() => {
		setPhase("opening");
	}, []);

	const onCardOpened = useCallback(() => {
		setPhase("revealing");
	}, []);

	const onRevealComplete = useCallback(() => {
		setPhase("complete");
		setHasOpened(true);
		try {
			localStorage.setItem(STORAGE_KEYS.INVITATION_OPENED, "true");
		} catch {
			// Ignore localStorage errors
		}
	}, []);

	const resetAnimation = useCallback(() => {
		setPhase("sealed");
		setHasOpened(false);
		try {
			localStorage.removeItem(STORAGE_KEYS.INVITATION_OPENED);
		} catch {
			// Ignore localStorage errors
		}
	}, []);

	return {
		phase,
		hasOpened,
		startAnimation,
		onSealBroken,
		onCardOpened,
		onRevealComplete,
		resetAnimation,
	};
}
