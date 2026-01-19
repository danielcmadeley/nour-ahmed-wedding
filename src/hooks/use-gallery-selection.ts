import { useCallback, useState } from "react";

export function useGallerySelection() {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
	const [selectionMode, setSelectionMode] = useState(false);

	const handleSelect = useCallback((key: string, selected: boolean) => {
		setSelectedKeys((prev) => {
			const next = new Set(prev);
			if (selected) {
				next.add(key);
			} else {
				next.delete(key);
			}
			return next;
		});
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedKeys(new Set());
		setSelectionMode(false);
	}, []);

	const toggleSelectionMode = useCallback(() => {
		setSelectionMode((prev) => !prev);
		if (selectionMode) {
			setSelectedKeys(new Set());
		}
	}, [selectionMode]);

	return {
		selectedKeys,
		selectionMode,
		handleSelect,
		clearSelection,
		toggleSelectionMode,
	};
}
