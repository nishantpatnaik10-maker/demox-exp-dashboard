// Engagements Calendar Data
// Engagements are persisted in localStorage (key: "exp26_engagements")
// This file provides the seed/initial data structure.
// To pre-populate engagements, add entries to INITIAL_ENGAGEMENTS below.

const ENGAGEMENTS_STORAGE_KEY = "exp26_engagements";

const INITIAL_ENGAGEMENTS = [
  {
    "title": "Booking.com",
    "date": "2026-06-23",
    "endDate": "2026-06-23",
    "gameboard": "exp26-gameboard-1.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781848136754"
  },
  {
    "title": "EBC Opening",
    "date": "2026-06-25",
    "endDate": "2026-06-25",
    "gameboard": "exp26-gameboard-1.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781848164435"
  },
  {
    "title": "Verizon",
    "date": "2026-06-24",
    "endDate": "2026-06-24",
    "gameboard": "exp26-gameboard-2.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781848189053"
  }
];

const ENGAGEMENT_TYPES = [
  "Workshop",
  "Demo",
  "Training",
  "Review",
  "Planning",
  "Other"
];

function loadEngagements() {
  const stored = localStorage.getItem(ENGAGEMENTS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  saveEngagements(INITIAL_ENGAGEMENTS);
  return INITIAL_ENGAGEMENTS;
}

function saveEngagements(engagements) {
  localStorage.setItem(ENGAGEMENTS_STORAGE_KEY, JSON.stringify(engagements));
}

function addEngagement(engagement) {
  const all = loadEngagements();
  engagement.id = "eng-" + Date.now();
  all.push(engagement);
  saveEngagements(all);
  return all;
}

function deleteEngagement(id) {
  const all = loadEngagements().filter(e => e.id !== id);
  saveEngagements(all);
  return all;
}

function updateEngagement(id, updates) {
  const all = loadEngagements().map(e => e.id === id ? { ...e, ...updates } : e);
  saveEngagements(all);
  return all;
}

function exportEngagementsAsJS() {
  const all = loadEngagements();
  const json = JSON.stringify(all, null, 2);
  const content = `// Auto-exported from EXP26 Dashboard\nconst INITIAL_ENGAGEMENTS = ${json};`;
  const blob = new Blob([content], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'engagements.js';
  a.click();
}
