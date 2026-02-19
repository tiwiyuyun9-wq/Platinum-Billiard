export const getStorageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL

    // Replace with your actual project URL
    const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const BUCKET = 'web-assets';

    return `${PROJECT_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};
