const session = {
  completedPomodoros: 0,
};

export function recordPomodoro() {
  session.completedPomodoros += 1;
  return session.completedPomodoros;
}

export function getPomodoroCount() {
  return session.completedPomodoros;
}
