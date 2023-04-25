export function getRankDifference(rankDifference: number | null) {
  if (rankDifference === null) {
    return null;
  }
  if (rankDifference === 0) {
    return '=';
  } else if (rankDifference > 0) {
    return '🟢';
  } else if (rankDifference < 0) {
    return '🔻';
  }
}

export function calculateRankDifference(
  currentName: string,
  currentRank: number,
  previousData: any[]
) {
  const previousEntry = previousData.find(
    (entry) => entry.Name === currentName
  );

  if (!previousEntry) {
    return null;
  }
  return previousEntry.Rank - currentRank;
}
