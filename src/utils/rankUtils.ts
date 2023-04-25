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

  console.log('currentName:', currentName);
  console.log('currentRank:', currentRank);
  console.log('previousData:', previousData);
  console.log('previousEntry:', previousEntry);

  if (!previousEntry) {
    return null;
  }

  console.log('previousEntry.Rank:', previousEntry.Rank);
  console.log(
    'previousEntry.Rank - currentRank:',
    previousEntry.Rank - currentRank
  );

  return previousEntry.Rank - currentRank;
}
