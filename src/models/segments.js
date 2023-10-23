class Segment {
  constructor({ s_key, title, rules_operator }) {
    this.s_key = Segment.parseSKey(s_key);
    this.title = Segment.parseTitle(title);
    this.rules_operator = Segment.parseRulesOperator(rules_operator);
  }

  static parseSKey(s_key) {
    if (!Segment.validateSKey(s_key)) {
      throw new Error({ error: "Valid s_key is required" });
    }

    if (s_key.length > 20) {
      s_key = s_key.slice(0, 20);
    }

    return s_key;
  }

  static validateSKey(s_key) {
    let re = new RegExp("^[A-Za-z0-9._-]+$");
    return re.test(s_key);
  }

  static parseTitle(title) {
    if (!Segment.validateTitle(title)) {
      title = "";
    }

    return title;
  }

  static validateTitle(title) {
    return !!title;
  }

  static parseRulesOperator(rules_operator) {
    if (!Segment.validateRulesOperator(rules_operator)) {
      // is there a default rules_operator?
    }

    return rules_operator;
  }

  static validateRulesOperator(rules_operator) {
    return ["all", "any"].indexOf(rules_operator) !== -1;
  }

  updateProps({ title, rules_operator }) {
    if (title) {
      this.title = Segment.parseTitle(title);
    }

    if (rules_operator) {
      this.rules_operator = Segment.parseRulesOperator(rules_operator);
    }
  }
}

export default Segment;
