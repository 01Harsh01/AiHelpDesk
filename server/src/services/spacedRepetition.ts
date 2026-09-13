export type SpacedRepetitionRating = "again" | "hard" | "good" | "easy";

export interface SM2Input {
  interval_days: number;
  repetition_count: number;
  easiness_factor: number;
  rating: SpacedRepetitionRating;
}

export interface SM2Output {
  interval_days: number;
  repetition_count: number;
  easiness_factor: number;
  next_review_date: string;
  state: "new" | "learning" | "review";
}

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 */
export function calculateSM2({
  interval_days,
  repetition_count,
  easiness_factor,
  rating,
}: SM2Input): SM2Output {
  let newRepetition = repetition_count;
  let newInterval = interval_days;
  let newEF = easiness_factor || 2.5;
  let newState: "new" | "learning" | "review" = "review";

  if (rating === "again") {
    newRepetition = 0;
    newInterval = 1;
    newEF = Math.max(1.3, newEF - 0.2);
    newState = "learning";
  } else if (rating === "hard") {
    newRepetition = Math.max(1, newRepetition);
    newInterval = Math.max(1, Math.round(newInterval * 1.2));
    newEF = Math.max(1.3, newEF - 0.15);
    newState = "learning";
  } else if (rating === "good") {
    if (newRepetition === 0) {
      newInterval = 1;
    } else if (newRepetition === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(newInterval * newEF);
    }
    newRepetition += 1;
    newState = "review";
  } else if (rating === "easy") {
    if (newRepetition === 0) {
      newInterval = 2;
    } else if (newRepetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(newInterval * newEF * 1.3);
    }
    newRepetition += 1;
    newEF = Math.min(3.0, newEF + 0.15);
    newState = "review";
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    interval_days: newInterval,
    repetition_count: newRepetition,
    easiness_factor: Math.round(newEF * 100) / 100,
    next_review_date: nextDate.toISOString(),
    state: newState,
  };
}
