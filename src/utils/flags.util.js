const segmentNotAdded = (flag, s_key) => {
  return !flag.segments.some((segment) => segment.s_key === s_key);
};

const getSegmentBySKey = (flag, segmentKey) => {
  return flag.segments.find(({ s_key }) => s_key === segmentKey);
};

export const trimFlagData = (flags) => {
  const trimmed = {};

  flags.forEach((flag) => {
    // Add flag information
    const { f_key, is_active, updated_at } = flag;
    trimmed[f_key] = trimmed[f_key] || { f_key, is_active, updated_at };

    // Add segment information
    const { s_key, rules_operator } = flag;
    trimmed[f_key].segments = trimmed[f_key].segments || [];

    if (s_key && segmentNotAdded(trimmed[f_key], s_key)) {
      trimmed[f_key].segments.push({ s_key, rules_operator, rules: [] });
    }

    // Add rule to segment.
    if (s_key) {
      const { r_key, a_key, type, operator, value } = flag;

      const segment = getSegmentBySKey(trimmed[f_key], s_key);
      segment.rules.push({ r_key, a_key, type, operator, value });
    }
  });

  return trimmed;
};
