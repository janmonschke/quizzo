export function getNewPosition({
  oldIndex,
  newIndex,
  items,
}: {
  oldIndex: number;
  newIndex: number;
  items: { position: number }[];
}) {
  const itemBeforeIndex = newIndex - 1;
  const itemBefore = items[itemBeforeIndex];
  if (!itemBefore) {
    return items[0].position - 1;
  }
  const itemAfterIndex = newIndex + 1;
  const itemAfter = items[itemAfterIndex];
  if (!itemAfter) {
    return items[items.length - 1].position + 1;
  }

  const movingDownInList = oldIndex < newIndex;
  if (movingDownInList) {
    // When moving down the list, we need to place the item
    // between the new position and the position after
    const afterPosition = items[itemAfterIndex].position;
    const atPosition = items[newIndex].position;

    return afterPosition + (atPosition - afterPosition) / 2;
  } else {
    // When moving up the list, we need to place the item
    // between the new position and the position before
    const beforePosition = items[itemBeforeIndex].position;
    const atPosition = items[newIndex].position;

    return beforePosition + (atPosition - beforePosition) / 2;
  }
}
