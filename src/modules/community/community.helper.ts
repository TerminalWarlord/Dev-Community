import { Model } from "mongoose";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { Community } from "src/schemas/community.schema";

export async function generateSlug(name: string, communityModel: Model<Community>) {
  const slug = slugify(name, {
    lower: true,
  });
  let checkedDefault = false;
  while (true) {
    let curSlug = slug;
    if (checkedDefault) {
      curSlug += "-" + nanoid();
    }
    else {
      checkedDefault = true;
    }
    const community = await communityModel.findOne({
      slug: curSlug
    });
    if (!community) {
      return curSlug;
    }
  }
}