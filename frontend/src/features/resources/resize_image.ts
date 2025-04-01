"use client"
import Resizer from "react-image-file-resizer";

export const resizeImage = async (file: File) => {
  if (typeof window !== 'undefined') { // Ensure this runs only in the browser
    return new Promise<File>((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        2160,
        1080,
        'JPEG',
        100,
        0,
        (result: string | Blob | File | ProgressEvent<FileReader>) => { 
          // Handle the result which can be string, Blob, File, or ProgressEvent
          if (typeof result === 'string') {
            // If it's a Base64 string, convert it to a File object
            try {
              const byteString = atob(result.split(',')[1]); // Remove the "data:image/jpeg;base64," prefix
              const arrayBuffer = new ArrayBuffer(byteString.length);
              const uint8Array = new Uint8Array(arrayBuffer);

              for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
              }

              const blob = new Blob([uint8Array], { type: 'image/jpeg' });
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });

              resolve(resizedFile);
            } catch (error) {
              console.log(error);
              reject(new Error('Error resizing the image.'));
            }
          } else if (result instanceof Blob) {
            // If it's already a Blob, we can directly create a File from it
            const resizedFile = new File([result], file.name, { type: 'image/jpeg' });
            resolve(resizedFile);
          } else if (result instanceof File) {
            // If it's already a File, we can directly use it
            resolve(result);
          } else {
            reject(new Error('Unexpected result type.'));
          }
        },
        'base64', // Return Base64 string
        2160,     // Max width
        1080      // Max height
      );
    });
  } else {
    throw new Error('Resizing only works on the client side.');
  }
};
