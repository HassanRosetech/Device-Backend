import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  const file = form?.find((f) => f.name === 'file');
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const fileName = `${uuidv4()}_${file.filename}`;
  const filePath = join("public/uploads", fileName);
  await writeFile(filePath, file.data);

  return {
    url: `/uploads/${fileName}`,
  };
});
