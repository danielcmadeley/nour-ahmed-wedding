// src/router.tsx
import { createRouter, Link } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function NotFoundComponent() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
			<h1 className="text-6xl font-bold text-neutral-300 dark:text-neutral-700">
				404
			</h1>
			<p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400">
				Page not found
			</p>
			<Link
				to="/"
				className="mt-6 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
			>
				Back to Gallery
			</Link>
		</div>
	);
}

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: NotFoundComponent,
	});

	return router;
}
