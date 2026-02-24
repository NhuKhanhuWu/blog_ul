/** @format */

import { Model } from "mongoose";
import slugify from "slugify";

const RESERVED_SLUGS = ["me", "admin", "login", "register"];

// create slug when user sign up/update account infor
export async function generateUniqueSlug(
  model: Model<any>,
  name: string,
  id?: string,
) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    //  Prevent reserved keywords
    if (RESERVED_SLUGS.includes(slug)) {
      slug = `${baseSlug}-${counter++}`;
      continue;
    }

    // Look for the slug, but ignore the document we are currently editing
    const existingDoc = await model.findOne({ slug, _id: { $ne: id } });

    if (!existingDoc) break;

    // if this is the doc which updating => skip
    if (id && existingDoc._id.toString() === id) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
