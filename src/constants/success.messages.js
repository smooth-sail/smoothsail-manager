export const succDeletedItem = (itemName) =>
  `${
    itemName.charAt(0).toUpperCase() + itemName.slice(1)
  } successfully deleted.`;
