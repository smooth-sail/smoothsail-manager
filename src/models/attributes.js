class Attribute {
  constructor({ a_key, name, type }) {
    this.a_key = Attribute.parseAKey(a_key);
    this.name = Attribute.parseName(name);
    this.type = Attribute.parseType(type);
  }

  static parseAKey(attributeKey) {
    if (!Attribute.validateAKey(attributeKey)) {
      throw new Error({ error: "Valid a_key is required" });
    }

    if (attributeKey.length > 20) {
      attributeKey = attributeKey.slice(0, 20);
    }

    return attributeKey;
  }

  static validateAKey(attributeKey) {
    let re = new RegExp("^[A-Za-z0-9._-]+$");
    return re.test(attributeKey);
  }

  static parseName(name) {
    if (!Attribute.validateName(name)) {
      throw new Error({ error: "Valid name is required" });
    }

    if (name.length > 100) {
      name = name.slice(0, 100);
    }

    return name;
  }

  static validateName(name) {
    return !!name;
  }

  static parseType(type) {
    if (!Attribute.validateType(type)) {
      throw new Error({ error: "Valid type is required" });
    }

    return type;
  }

  static validateType(type) {
    return !!type;
  }

  updateProps({ name, type }) {
    if (name) {
      this.name = Attribute.parseName(name);
    }

    if (type) {
      this.type = Attribute.parseType(type);
    }
  }
}

export default Attribute;
