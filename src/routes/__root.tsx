/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { InAppBrowserBanner } from "@/src/components/in-app-browser-banner";
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
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
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
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<InAppBrowserBanner />
				{children}
				<Toaster />
				<Scripts />
			</body>
		</html>
	);
}
