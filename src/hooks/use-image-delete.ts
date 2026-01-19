import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteImages } from "@/src/lib/api/images";
import { QUERY_KEYS } from "@/src/lib/constants";

export function useImageDelete() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteImages,
		onSuccess: (_, keys) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IMAGES });
			const count = keys.length;
			toast.success(
				count === 1
					? "Image deleted successfully"
					: `${count} images deleted successfully`,
			);
		},
		onError: (error) => {
			toast.error("Failed to delete images", {
				description: error.message,
			});
		},
	});

	const handleDelete = (keys: string[]) => {
		deleteMutation.mutate(keys);
	};

	return {
		handleDelete,
		isDeleting: deleteMutation.isPending,
	};
}
