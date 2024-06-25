// Define the base URLs
export const baseURL = "https://persanalytics.com/doutya/api";
export const baseImgURL = "https://persanalytics.com/doutya/photos/";
export const baseVidUrl = "https://persanalytics.com/doutya/videos/";

// Uncomment these lines if you need to switch to local URLs
// export const baseURL = "http://192.168.1.9/Zen/doutya/api";
// export const baseImgURL = "http://192.168.1.9/Zen/doutya/photos/";
// export const baseVidUrl = "http://192.168.1.9/Zen/doutya/videos/";
// export const baseURL = "http://172.20.10.4/Zen/doutya/api";
// export const baseImgURL = "http://172.20.10.4/Zen/doutya/photos/";
// export const baseVidUrl = "http://172.20.10.4/Zen/doutya/videos/";

// Define the generateSlug function
function generateSlug(title) {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/[^a-z0-9 -]/g, '') // Remove any character that is not alphanumeric, space, or hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
}

// Export the generateSlug function
export { generateSlug };
