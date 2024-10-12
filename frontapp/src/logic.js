let newStreak = user.streak;
if (user.last_activity) {
  const daysSinceLastActivity = dateDiffInDays(user.last_activity, today);
  if (daysSinceLastActivity === 1) {
    newStreak += 1;  // Streak continues
  } else if (daysSinceLastActivity > 1) {
    newStreak = 1;   // Streak resets due to a missed day
  }
} else {
  newStreak = 1;  // First day of streak
}
