import { nanoid } from "nanoid";
import slugify from "slugify";
import { Community } from "src/entities/community.entity";
import { Repository } from "typeorm";

export async function generateSlug(name: string, communityRepo: Repository<Community>) {
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
    const community = await communityRepo.findOne({
      where: {
        slug: curSlug
      }
    });
    if (!community) {
      return curSlug;
    }
  }
}