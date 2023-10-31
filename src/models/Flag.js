import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Flag = sequelize.define(
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
        get() {
          const rawDate = this.getDataValue("createdAt");
          const date = new Date(`${rawDate}`);
          return date.toLocaleTimeString("default", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        timezone: true,
        allowNull: false,
        field: "updated_at",
        get() {
          const rawDate = this.getDataValue("updatedAt");
          const date = new Date(`${rawDate}`);
          return date.toLocaleTimeString("default", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        },
      },
    },
    {
      sequelize,
      tableName: "flags",
    }
  );
  return Flag;
};
