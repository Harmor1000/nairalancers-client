import axios from 'axios';

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Nairalancers");

  // Determine the appropriate Cloudinary endpoint and resource type based on file type
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  let endpoint, resourceType;
  
  if (isImage) {
    endpoint = "https://api.cloudinary.com/v1_1/dc70ptysa/image/upload";
    // No need to set resource_type for images (default is 'image')
  } else if (isVideo) {
    endpoint = "https://api.cloudinary.com/v1_1/dc70ptysa/video/upload";
    data.append("resource_type", "video");
  } else {
    // For PDFs, documents, and other non-media files
    endpoint = "https://api.cloudinary.com/v1_1/dc70ptysa/raw/upload";
    data.append("resource_type", "raw");
  }

  try {
    const res = await axios.post(endpoint, data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Upload error:", err);
    console.error("File type:", file.type, "File name:", file.name);
    throw err;
  }
};

export default upload;