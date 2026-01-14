import {
	generateReactHelpers,
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";
import type { UploadRouter } from "@/src/server/uploadthing";

const uploadThingConfig = {
	url: "/api/uploadthing",
} as const;

export const UploadButton =
	generateUploadButton<UploadRouter>(uploadThingConfig);
export const UploadDropzone =
	generateUploadDropzone<UploadRouter>(uploadThingConfig);
export const { useUploadThing } =
	generateReactHelpers<UploadRouter>(uploadThingConfig);
