import initFlag from "./Flag";
import initSegment from "./Segment";
import initAttribute from "./Attribute";
import initFlagSegments from "./FlagSegments";
import initRule from "./Rule";
import sequelize from "./sequelize";

const Flag = initFlag(sequelize);
const Segment = initSegment(sequelize);
const Attribute = initAttribute(sequelize);
const FlagSegments = initFlagSegments(sequelize, Segment, Flag);
const Rule = initRule(sequelize, Attribute, Segment);

Flag.belongsToMany(Segment, { through: FlagSegments });
Segment.belongsToMany(Flag, { through: FlagSegments });

Segment.hasMany(Rule, {
  onDelete: "CASCADE",
});
Rule.belongsTo(Segment);
Attribute.hasMany(Rule, {
  onDelete: "CASCADE",
});
Rule.belongsTo(Attribute);

export { Flag, Segment, Attribute, Rule, sequelize };
