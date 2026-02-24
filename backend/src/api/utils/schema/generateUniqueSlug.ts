/** @format */

import slugify from "slugify";

// create slug when user sign up/update account infor
export async function generateUniqueSlug(
  model: any,
  name: string,
  userId?: string,
) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingUser = await model.findOne({ slug });

    if (!existingUser) break;

    // if this is the user who updating => skip
    if (userId && existingUser._id.toString() === userId) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
