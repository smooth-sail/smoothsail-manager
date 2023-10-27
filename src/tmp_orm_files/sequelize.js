import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    // logging: (...msg) => console.log(msg), // might change this or delete (depending on what logging we want);
  }
);

export const getDBClient = async () => {
  try {
    const dbClient = await sequelize.authenticate();
    console.log("Sequelize: Connection has been established successfully.");
    return dbClient;
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

export const Flag = sequelize.define(
  "Flag",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "f_key",
      validate: {
        is: /^[a-z0-9._-]+$/i,
        len: [1, 20],
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_active",
      validate: {
        isBool(val) {
          console.log("helo");
          if (typeof val !== "boolean") {
            throw new Error("The type of isActive must be boolean.");
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      timezone: true,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      timezone: true,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    // modelName: "Flag",
    tableName: "flags",
  }
);

export const Segment = sequelize.define(
  "Segment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    sKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "s_key",
      validate: {
        is: /^[a-z0-9._-]+$/i,
        len: [1, 20],
      },
    },
    title: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    rulesOperator: {
      type: DataTypes.STRING(3),
      allowNull: false,
      field: "rules_operator",
      defaultValue: "all",
      validate: {
        len: [3, 3],
        is: /^(all|any)$/i,
      },
      set(val) {
        this.setDataValue("rulesOperator", val.toLowerCase());
      },
    },
  },
  {
    sequelize,
    tableName: "segments",
    timestamps: false,
  }
);

const FlagSegments = sequelize.define(
  "FlagSegments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    FlagId: {
      type: DataTypes.INTEGER,
      field: "flag_id",
      references: {
        model: Flag,
        key: "id",
      },
    },
    SegmentId: {
      type: DataTypes.INTEGER,
      field: "segment_id",
      references: {
        model: Segment,
        key: "id",
      },
    },
  },
  {
    sequelize,
    // modelName: "FlagSegments",
    tableName: "flags_segments",
    timestamps: false,
  }
);

Flag.belongsToMany(Segment, { through: FlagSegments });
Segment.belongsToMany(Flag, { through: FlagSegments });

export const Attribute = sequelize.define(
  "Attribute",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    aKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "a_key",
      validate: {
        is: /^[a-z0-9._-]+$/i,
        len: [1, 20],
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      validate: {
        len: [0, 100],
      },
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "string",
      validate: {
        len: [1, 20],
        is: /^(boolean|string|number)$/i,
      },
      set(val) {
        this.setDataValue("type", val.toLowerCase());
      },
    },
  },
  {
    sequelize,
    tableName: "attributes",
    timestamps: false,
  }
);

// rule needs checking with postman

export const Rule = sequelize.define(
  "Rule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    rKey: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "r_key",
    },
    operator: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "operator",
      set(val) {
        this.setDataValue("operator", val.toLowerCase());
      },
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    AttributeId: {
      type: DataTypes.INTEGER,
      field: "attribute_id",
      references: {
        model: Attribute,
        key: "id",
      },
    },
    SegmentId: {
      type: DataTypes.INTEGER,
      field: "segment_id",
      references: {
        model: Segment,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "rules",
    timestamps: false,
  }
);

Segment.hasMany(Rule, {
  onDelete: "CASCADE",
});
Rule.belongsTo(Segment);
Attribute.hasMany(Rule, {
  onDelete: "CASCADE",
});
Rule.belongsTo(Attribute);
