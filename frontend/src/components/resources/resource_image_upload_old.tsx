"use client"

import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { FileUpload, FileUploadBeforeUploadEvent, FileUploadHeaderTemplateOptions, ItemTemplateOptions } from "primereact/fileupload";
import { useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useResourceContext } from "@/contexts/resources/context";
import { ResourceWithImage } from "@/types/resources";

export default function ResourceImageUpload() {
	const data: ResourceWithImage = useResourceContext();

	const onBeforeUploader = (event: FileUploadBeforeUploadEvent) => {
		const formData = event.formData
		formData.append("resourceId", data.id);
	};
	return (
		<Card title="Upload image" className="">
			{/* <Toast ref={toast}></Toast>
			<Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
			<Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
			<Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

			<FileUpload
				name="files"
				multiple
				accept="image/*"
				maxFileSize={10000000000}
				url="/api/upload"
				headerTemplate={headerTemplate}
				onBeforeUpload={onBeforeUploader}
				emptyTemplate={emptyTemplate}
				itemTemplate={itemTemplate}
				chooseOptions={chooseOptions}
				uploadOptions={uploadOptions}
				cancelOptions={cancelOptions}
			/> */}
			{/* <FileUpload mode="basic" auto name="files" url="/api/upload" multiple accept="image/*" maxFileSize={10000000}  onBeforeUpload={onBeforeUploader} /> */}
			{/* <FileUpload name="files" url={'/api/upload'} multiple accept="image/*" maxFileSize={10000000} onBeforeUpload={onBeforeUploader} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} /> */}
			<FileUpload name="files" url={'/api/zip'} accept=".zip" maxFileSize={100000000000} onBeforeUpload={onBeforeUploader} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
		</Card>
	)
}
