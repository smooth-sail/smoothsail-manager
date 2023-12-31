import { DataTypes } from "sequelize";

export default (sequelize, Segment, Flag) => {
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
      tableName: "flags_segments",
      timestamps: false,
    }
  );
  return FlagSegments;
};
