import { DownloadIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/src/components/ui/button";

export function PWAPrompt() {
	const [showInstallPrompt, setShowInstallPrompt] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			console.log("SW Registered: " + r);
		},
		onRegisterError(error) {
			console.log("SW registration error", error);
		},
	});

	useEffect(() => {
		const handler = (e: Event) => {
			// Prevent the mini-infobar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later
			setDeferredPrompt(e);
			// Show install prompt
			setShowInstallPrompt(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// Show the install prompt
		(deferredPrompt as any).prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await (deferredPrompt as any).userChoice;

		if (outcome === "accepted") {
			console.log("User accepted the install prompt");
		}

		// Clear the deferredPrompt
		setDeferredPrompt(null);
		setShowInstallPrompt(false);
	};

	const close = () => {
		setNeedRefresh(false);
	};

	if (needRefresh) {
		return (
			<div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-lg">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
							Update Available
						</h3>
						<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
							A new version of the app is available. Reload to update.
						</p>
					</div>
					<button
						type="button"
						onClick={close}
						className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
					>
						<XIcon className="size-4" />
					</button>
				</div>
				<div className="mt-4 flex gap-2">
					<Button size="sm" onClick={() => updateServiceWorker(true)}>
						Reload
					</Button>
					<Button variant="outline" size="sm" onClick={close}>
						Later
					</Button>
				</div>
			</div>
		);
	}

	if (showInstallPrompt && deferredPrompt) {
		return (
			<div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-lg">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
							Install Wedding Gallery
						</h3>
						<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
							Install this app on your device for quick access and better
							performance.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowInstallPrompt(false)}
						className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
					>
						<XIcon className="size-4" />
					</button>
				</div>
				<div className="mt-4 flex gap-2">
					<Button size="sm" onClick={handleInstallClick}>
						<DownloadIcon className="size-4" />
						Install
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowInstallPrompt(false)}
					>
						Not now
					</Button>
				</div>
			</div>
		);
	}

	return null;
}
