export const calculateScore = (sliderValue) => {
  if (sliderValue < 25) return 1; // Don't know
  if (sliderValue < 50) return 2; // Need to review
  if (sliderValue < 75) return 3; // Almost got it
  return 4; // Know it!
};

export const getScoreLabel = (score) => {
  switch(score) {
    case 1: return "Don't know";
    case 2: return "Need to review";
    case 3: return "Almost got it";
    case 4: return "Know it!";
    default: return "Not answered";
  }
};

export const getScoreColor = (score) => {
  switch(score) {
    case 1: return "#EF4444"; // red
    case 2: return "#FFA500"; // orange
    case 3: return "#FBBF24"; // yellow
    case 4: return "#10B981"; // green
    default: return "#6B7280"; // gray
  }
};