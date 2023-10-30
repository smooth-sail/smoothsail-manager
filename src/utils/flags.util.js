import { Flag, Segment, Attribute, Rule } from "../models/sequelize";
import { formatSegments } from "../controllers/flags.controller";

const segmentNotAdded = (flag, s_key) => {
  return !flag.segments.some((segment) => segment.s_key === s_key);
};

const getSegmentByKey = (flag, segmentKey) => {
  return flag.segments.find(({ s_key }) => s_key === segmentKey);
};

export const transformFlagData = (flags) => {
  const obj = {};

  flags.forEach((flag) => {
    // Add flag information
    const { f_key, is_active, updated_at } = flag;
    obj[f_key] = obj[f_key] || { f_key, is_active, updated_at };

    // Add segment information
    const { s_key, rules_operator } = flag;
    if (s_key) {
      obj[f_key].segments = obj[f_key].segments || [];

      if (segmentNotAdded(obj[f_key], s_key)) {
        obj[f_key].segments.push({ s_key, rules_operator, rules: [] });
      }

      // Add rule to segment
      const { r_key, a_key, type, operator, value } = flag;

      const segment = getSegmentByKey(obj[f_key], s_key);
      segment.rules.push({ r_key, a_key, type, operator, value });
    }
  });

  return obj;
};

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
