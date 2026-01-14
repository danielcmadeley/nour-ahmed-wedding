import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { ExternalLinkIcon, XIcon } from "lucide-react";

/**
 * Detects if the user is using an in-app browser (WebView)
 * These browsers often have limited access to camera and photo gallery
 */
function detectInAppBrowser(): { isInApp: boolean; browserName: string | null } {
	if (typeof window === "undefined" || typeof navigator === "undefined") {
		return { isInApp: false, browserName: null };
	}

	const ua = navigator.userAgent || navigator.vendor || "";

	// Common in-app browser patterns
	const inAppPatterns: { pattern: RegExp; name: string }[] = [
		{ pattern: /Instagram/i, name: "Instagram" },
		{ pattern: /FBAN|FBAV/i, name: "Facebook" },
		{ pattern: /WhatsApp/i, name: "WhatsApp" },
		{ pattern: /Twitter|X/i, name: "X (Twitter)" },
		{ pattern: /LinkedIn/i, name: "LinkedIn" },
		{ pattern: /TikTok|BytedanceWebview/i, name: "TikTok" },
		{ pattern: /Snapchat/i, name: "Snapchat" },
		{ pattern: /Pinterest/i, name: "Pinterest" },
		{ pattern: /MicroMessenger/i, name: "WeChat" },
		{ pattern: /Line\//i, name: "Line" },
		{ pattern: /Telegram/i, name: "Telegram" },
		{ pattern: /Discord/i, name: "Discord" },
		{ pattern: /Slack/i, name: "Slack" },
		{ pattern: /Perplexity/i, name: "Perplexity" },
	];

	for (const { pattern, name } of inAppPatterns) {
		if (pattern.test(ua)) {
			return { isInApp: true, browserName: name };
		}
	}

	// Generic WebView detection (less specific)
	// Check for common WebView indicators when not in a known browser
	const isWebView =
		// Android WebView
		(/wv/.test(ua) && /Android/.test(ua)) ||
		// iOS WebView (not Safari)
		(/iPhone|iPad|iPod/.test(ua) &&
			!/Safari/.test(ua) &&
			!/CriOS/.test(ua) &&
			!/FxiOS/.test(ua));

	if (isWebView) {
		return { isInApp: true, browserName: null };
	}

	return { isInApp: false, browserName: null };
}

export function InAppBrowserBanner() {
	const [isVisible, setIsVisible] = useState(false);
	const [browserInfo, setBrowserInfo] = useState<{
		isInApp: boolean;
		browserName: string | null;
	}>({ isInApp: false, browserName: null });

	useEffect(() => {
		// Only run on client
		const info = detectInAppBrowser();
		setBrowserInfo(info);

		// Check if user has dismissed the banner before
		const dismissed = sessionStorage.getItem("inAppBannerDismissed");
		if (info.isInApp && !dismissed) {
			setIsVisible(true);
		}
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		sessionStorage.setItem("inAppBannerDismissed", "true");
	};

	const handleOpenInBrowser = () => {
		// Copy URL to clipboard and show instructions
		const url = window.location.href;
		navigator.clipboard?.writeText(url);
		
		// Try to open in default browser (works on some platforms)
		// For iOS: window.open with _system might work
		// For Android: intent URLs can work but are complex
		
		// Show alert with instructions as fallback
		alert(
			"URL copied to clipboard!\n\n" +
			"To open in your browser:\n" +
			"1. Open Chrome, Safari, or Edge\n" +
			"2. Paste the URL in the address bar\n\n" +
			"This will give you full access to camera and photo gallery."
		);
	};

	if (!isVisible) {
		return null;
	}

	const browserName = browserInfo.browserName || "an in-app browser";
	const isAndroid = /Android/i.test(navigator.userAgent);
	const suggestedBrowser = isAndroid ? "Chrome" : "Safari";

	return (
		<div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
			<div className="flex items-start gap-3 max-w-4xl mx-auto">
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-amber-800">
						Limited browser detected
					</p>
					<p className="text-sm text-amber-700 mt-0.5">
						You're using {browserName}. For the best experience with photo
						uploads (camera & gallery access), open this page in{" "}
						<span className="font-medium">{suggestedBrowser}</span>.
					</p>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<Button
						size="sm"
						variant="outline"
						className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
						onClick={handleOpenInBrowser}
					>
						<ExternalLinkIcon className="size-3.5" />
						<span className="hidden sm:inline">Copy Link</span>
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 px-2"
						onClick={handleDismiss}
						aria-label="Dismiss"
					>
						<XIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
