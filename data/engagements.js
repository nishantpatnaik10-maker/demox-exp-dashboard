// Engagements Calendar Data
// Engagements are persisted in localStorage (key: "exp26_engagements")
// This file provides the seed/initial data structure.
// To pre-populate engagements, add entries to INITIAL_ENGAGEMENTS below.

const ENGAGEMENTS_STORAGE_KEY = "exp26_engagements";

const INITIAL_ENGAGEMENTS = [
  // Example engagement — remove or replace as needed
  // {
  //   id: "eng-001",
  //   title: "Customer Workshop",
  //   date: "2026-07-10",
  //   endDate: "2026-07-11",
  //   gameboard: "exp26-gameboard-1.pegademo.com",
  //   type: "Workshop",
  //   attendees: "Team A",
  //   notes: "Kickoff session"
  // }
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
  // Seed with initial data on first load
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
