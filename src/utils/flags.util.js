import { Flag, Segment, Attribute, Rule } from "../models/flag.models";
import { formatSegments } from "./segments.util";

export const getSdkFlags = async () => {
  let data = {};
  try {
    let flags = await Flag.findAll({
      attributes: { exclude: ["id", "title", "description", "createdAt"] },
      include: {
        model: Segment,
        include: {
          model: Rule,
          include: {
            model: Attribute,
          },
        },
      },
    });
    flags.forEach((f) => {
      f = f.toJSON();
      f.segments = formatSegments(f.Segments, true);
      delete f.Segments;
      data[f.fKey] = f;
    });
  } catch (err) {
    console.log(err);
  }
  return data;
};
