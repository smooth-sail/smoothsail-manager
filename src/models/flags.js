class Flag {
  constructor({ id, f_key, title, description, is_active }) {
    this.id = id;
    this.f_key = Flag.parseKey(f_key);
    this.title = Flag.parseTitle(title);
    this.description = Flag.parseDescription(description);
    this.is_active = Flag.setIsActive(is_active);
  }

  static parseKey(f_key) {
    if (!Flag.validateKey(f_key)) {
      throw new Error("Key is required");
    }

    return f_key;
  }

  static validateKey(f_key) {
    if (!f_key) {
      throw new Error("Key is required");
    } else if (f_key.length > 20 || !/^[A-Za-z0-9._-]+$/.test(f_key)) {
      throw new Error(
        "Key must be no more than 20 chars length. Only characters, digits, dots, underscore, and dash are allowed."
      );
    }
    return true;
  }

  static parseTitle(title) {
    if (!Flag.validateTitle(title)) {
      throw new Error("Title is required");
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
    if (!Flag.validateDescription(description)) {
      description = "";
    }

    return description;
  }

  static validateDescription(description) {
    return !!description;
  }

  static setIsActive(is_active) {
    if (is_active === true || is_active === false) {
      return is_active;
    }

    return false;
  }

  updateProps({ title, description }) {
    if (title) {
      this.title = Flag.parseTitle(title);
    }

    if (description) {
      this.description = Flag.parseDescription(description);
    }
  }

  updateIsActive(is_active) {
    // for proper coding would need to check if it's bool type
    console.log("in the Flag: ", is_active);
    if (is_active === true || is_active === false) {
      this.is_active = is_active;
    }
  }
}

export default Flag;
