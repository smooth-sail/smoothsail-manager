export const formatSegment = (s, forSDK) => {
  if (typeof s.get === "function") {
    s = s.get({ plain: true });
  }
  delete s.id;
  delete s.FlagSegments;

  if (forSDK) {
    delete s.title;
    delete s.description;
  }
  if (s.Rules) {
    let rules = s.Rules;
    delete s.Rules;
    s.rules = rules.map((r) => {
      if (typeof r.get === "function") {
        r = r.get({ plain: true });
      }

      r.aKey = r.Attribute.aKey;
      r.type = r.Attribute.type;
      delete r.Attribute;
      delete r.id;
      delete r.AttributeId;
      delete r.SegmentId;
      return r;
    });
  } else {
    s.rules = [];
  }

  return s;
};
export const formatSegments = (segments, forSDK) => {
  return segments.map((s) => {
    return formatSegment(s, forSDK);
  });
};
