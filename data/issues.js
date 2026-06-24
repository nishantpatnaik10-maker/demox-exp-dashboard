// Issues / Kanban Logic
// Data lives in issues-data.js (synced to GitHub by the Sync button)

const ISSUES_STORAGE_KEY = "exp26_issues";

const ISSUE_PRIORITIES = ["Critical", "High", "Medium", "Low"];
const ISSUE_CATEGORIES = ["Instance", "Gameboard", "Network", "Performance", "UI/UX", "Other"];
const KANBAN_COLUMNS = [
  { id: "backlog",     label: "Backlog",     color: "#6b7a99" },
  { id: "inprogress", label: "In Progress",  color: "#f0a500" },
  { id: "resolved",   label: "Resolved",     color: "#28a745" }
];

function loadIssues() {
  const stored = localStorage.getItem(ISSUES_STORAGE_KEY);
  if (stored) { return JSON.parse(stored); }
  saveIssues(INITIAL_ISSUES);
  return [...INITIAL_ISSUES];
}

function saveIssues(issues) {
  localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
}

function addIssue(issue) {
  const all = loadIssues();
  issue.id = "issue-" + Date.now();
  issue.createdAt = new Date().toISOString();
  issue.status = issue.status || "backlog";
  all.push(issue);
  saveIssues(all);
  return all;
}

function deleteIssue(id) {
  const all = loadIssues().filter(i => i.id !== id);
  saveIssues(all);
  return all;
}

function moveIssue(id, newStatus) {
  const all = loadIssues().map(i => i.id === id ? { ...i, status: newStatus, updatedAt: new Date().toISOString() } : i);
  saveIssues(all);
  return all;
}

function updateIssue(id, updates) {
  const all = loadIssues().map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
  saveIssues(all);
  return all;
}

// ===== GitHub Sync for Issues =====
async function syncIssuesToGitHub(issues, onStatus) {
  const { token, owner, repo, branch } = loadGHSettings();
  if (!token || !owner || !repo) {
    alert('Please configure GitHub Settings first (use the button on the Engagement Calendar tab).');
    return false;
  }

  const filePath = 'data/issues-data.js';
  const apiBase = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + filePath;
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };

  try {
    onStatus('Fetching from GitHub...');

    const getResp = await fetch(apiBase + '?ref=' + branch, { headers });
    let sha = null;

    if (getResp.ok) {
      sha = (await getResp.json()).sha;
    } else if (getResp.status === 401) {
      throw new Error('Authentication failed (401) — check your token has "repo" scope.');
    } else if (getResp.status === 404) {
      throw new Error('File not found (404) — check owner and repo are correct.');
    } else {
      const e = await getResp.json();
      throw new Error('GET ' + getResp.status + ': ' + e.message);
    }

    onStatus('Pushing to GitHub...');

    const json = JSON.stringify(issues, null, 2);
    const fileContent = [
      '// ISSUES / KANBAN DATA FILE',
      '// Auto-updated by Sync to GitHub on ' + new Date().toISOString(),
      '// Do not edit manually — use the dashboard.',
      '',
      'const INITIAL_ISSUES = ' + json + ';',
      ''
    ].join('\n');

    const encoded = btoa(unescape(encodeURIComponent(fileContent)));
    const body = {
      message: 'Update issues [' + new Date().toLocaleString() + ']',
      content: encoded,
      branch: branch,
      sha: sha
    };

    const putResp = await fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });

    if (!putResp.ok) {
      const e = await putResp.json();
      throw new Error('PUT ' + putResp.status + ': ' + e.message);
    }

    onStatus('Synced! GitHub Pages updates in ~1 min.');
    return true;
  } catch (err) {
    const msg = 'Sync failed: ' + err.message;
    onStatus(msg);
    alert(msg);
    return false;
  }
}
