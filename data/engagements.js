// Engagements Calendar Data
// Engagements are persisted in localStorage (key: "exp26_engagements")
// This file provides the seed/initial data structure.
// To pre-populate engagements, add entries to INITIAL_ENGAGEMENTS below.

const ENGAGEMENTS_STORAGE_KEY = "exp26_engagements";

const INITIAL_ENGAGEMENTS = [
  {
    "title": "Booking.com",
    "date": "2026-06-25",
    "endDate": "2026-06-25",
    "gameboard": "exp26-gameboard-1.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781845410356"
  },
  {
    "title": "Verizon",
    "date": "2026-06-24",
    "endDate": "2026-06-24",
    "gameboard": "exp26-gameboard-2.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781848364187"
  },
  {
    "title": "Booking.com",
    "date": "2026-06-23",
    "endDate": "2026-06-23",
    "gameboard": "exp26-gameboard-1.pegademo.com",
    "type": "Workshop",
    "attendees": "",
    "notes": "",
    "id": "eng-1781848395755"
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

function exportEngagementsAsJSON() {
  const all = loadEngagements();
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'engagements-backup.json';
  a.click();
}

function importEngagementsFromFile(file, onComplete) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Expected a JSON array');
      // Merge: add imported items that don't already exist (by id)
      const existing = loadEngagements();
      const existingIds = new Set(existing.map(x => x.id));
      const merged = [...existing, ...data.filter(x => !existingIds.has(x.id))];
      saveEngagements(merged);
      if (onComplete) onComplete(merged);
    } catch (err) {
      alert('Import failed: ' + err.message + '\nMake sure the file is a valid engagements JSON export.');
    }
  };
  reader.readAsText(file);
}
