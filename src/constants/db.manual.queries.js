export const updatedATFlagColManualSetQuery = (id) => {
  return `UPDATE flags SET updated_at = '${new Date().toISOString()}' WHERE id = ${id}`;
};
