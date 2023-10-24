const segmentNotAdded = (flag, s_key) => {
  return !flag.segments.some((segment) => segment.s_key === s_key);
};

const getSegmentBySKey = (flag, segmentKey) => {
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
      const segment = getSegmentBySKey(obj[f_key], s_key);
      segment.rules.push({ r_key, a_key, type, operator, value });
    }
  });

  return obj;
};
