class Segment {
  constructor({ s_key, title, description, rules_operator }) {
    this.s_key = Segment.parseSKey(s_key);
    this.title = Segment.parseTitle(title);
    this.description = Segment.parseDescription(description);
    this.rules_operator = Segment.parseRulesOperator(rules_operator);
    this.rules = [];
  }

  static parseSKey(segmentKey) {
    if (!Segment.validateSKey(segmentKey)) {
      throw new Error({ error: "Valid s_key is required" });
    }

    return segmentKey;
  }

  static validateSKey(segmentKey) {
    let re = new RegExp("^[A-Za-z0-9._-]+$");
    return (
      re.test(segmentKey) && segmentKey.length < 20 && segmentKey.length > 0
    );
  }

  static parseTitle(title) {
    if (!Segment.validateTitle(title)) {
      throw new Error({ error: "Valid title is required" });
    }
    if (title.length > 100) {
      title = title.slice(0, 100);
    }
    return title;
  }

  static validateTitle(title) {
    return !!title;
  }

  static parseDescription(description) {
    if (!Segment.validateDescription(description)) {
      description = "";
    }

    return description;
  }

  static validateDescription(description) {
    return !!description;
  }

  static parseRulesOperator(rules_operator) {
    if (!Segment.validateRulesOperator(rules_operator)) {
      rules_operator = "all";
    }

    return rules_operator;
  }

  static validateRulesOperator(rules_operator) {
    return ["all", "any"].indexOf(rules_operator) !== -1;
  }

  updateProps({ title, description, rules_operator }) {
    if (title) {
      this.title = Segment.parseTitle(title);
    }

    if (description) {
      this.description = Segment.parseDescription(description);
    }

    if (rules_operator) {
      this.rules_operator = Segment.parseRulesOperator(rules_operator);
    }
  }
}

export default Segment;
