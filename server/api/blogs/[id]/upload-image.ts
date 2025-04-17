import { IncomingForm } from 'formidable';
//import fs from 'fs';
import path from 'path';
//import { db } from '~/server/utils/db'; // Adjust path to fit your Nuxt project
//import { getRouterParam } from 'h3';
import { neon } from '@neondatabase/serverless';

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for file uploads
  },
};

export default defineEventHandler(async (event) => {
  // Setup the formidable form for file uploads
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/public/uploads'), // Where to store uploaded files
    keepExtensions: true, // Keep file extensions (e.g., .jpg, .png)
  });

  // Promise wrapper around the form parsing method
  const parseForm = (req) =>
    new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm(event.req);
    
    // Log the form fields and uploaded files for debugging
    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    // Extract blogId and image from fields and files
    const blogId = fields.blogId?.[0]; // blogId should be passed as a field in the form
    const file = files.image;

    // If file is uploaded, it can either be a single file or an array
    const uploadedFilePath = Array.isArray(file)
      ? file[0].filepath || file[0].path // Handle array structure if multiple files are uploaded
      : file?.filepath || file?.path; // Handle single file upload

    // Log the file path for debugging
    console.log('Uploaded file path:', uploadedFilePath);

    // Check if blogId or image file is missing
    if (!blogId || !uploadedFilePath) {
      throw new Error('Missing blogId or image file.');
    }

    // Extract the image name (file name only, not the full path)
    const imagePath = `${path.basename(uploadedFilePath)}`;
    
    // Log the image path and blogId for debugging
    console.log('Blog ID:', blogId);
    console.log('Image Path:', imagePath);

    // Update the blog with the new image URL in the database
    try {
      console.log('Updating blog with ID:', blogId, 'and image:', imagePath);


      
      // await db.query(
      //  'UPDATE blogs SET main_image = $1, updated_at = NOW() WHERE id = $2',
      
      //  [imagePath, blogId]
      // );

      //import { neon } from '@neondatabase/serverless';

      const { databaseUrl } = useRuntimeConfig()
      const db = neon(databaseUrl)

await db`UPDATE blogs SET main_image = ${imagePath}, updated_at = NOW() WHERE id = ${blogId}`;

     

    } catch (dbErr) {
      
      console.error('Database update failed:', dbErr.message);
      throw new Error('Database update error');
      
    }

    // Return success message with the image URL
    return {
      message: 'Image uploaded and blog updated successfully.',
      imageUrl: imagePath,
    };
  } catch (error) {
    // Log the error if any occurs during the file upload process
    console.error('Upload error:', error);
    return { error: 'Failed to upload and update image.' };
  }
});
