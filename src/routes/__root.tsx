/// <reference types="vite/client" />

import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PWAPrompt } from "@/src/components/pwa-prompt";
import { Toaster } from "@/src/components/ui/sonner";
import { queryClient } from "@/src/lib/query-client";
import "../styles/app.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content:
					"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
			},
			{
				title: "Wedding Gallery",
			},
			{
				name: "description",
				content: "Wedding photo gallery with upload and sharing capabilities",
			},
			{
				name: "theme-color",
				content: "#ffffff",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Wedding Gallery",
			},
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Great+Vibes&display=swap",
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "mask-icon",
				href: "/mask-icon.svg",
				color: "#000000",
			},
		],
	}),

	component: RootComponent,
});

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</QueryClientProvider>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="bg-neutral-50 text-neutral-900">
				{children}
				<Toaster />
				<PWAPrompt />
				<Scripts />
			</body>
		</html>
	);
}
