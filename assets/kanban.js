/* ===== Kanban Board ===== */

let kanbanState = {
  issues: [],
  dragId: null,
  filterSearch: '',
  filterPriority: ''
};

function initKanban() {
  kanbanState.issues = loadIssues();

  // Populate gameboard dropdown in modal
  const gbSelect = document.getElementById('issue-gameboard');
  INSTANCES_DATA.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.gameboard;
    opt.textContent = g.gameboard;
    gbSelect.appendChild(opt);
  });

  renderKanban();
  setupKanbanControls();
}

function renderKanban() {
  const board = document.getElementById('kanban-board');
  const { filterSearch, filterPriority } = kanbanState;

  board.innerHTML = KANBAN_COLUMNS.map(col => {
    let cards = kanbanState.issues.filter(i => i.status === col.id);

    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      cards = cards.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q) ||
        (i.assignee || '').toLowerCase().includes(q)
      );
    }
    if (filterPriority) {
      cards = cards.filter(i => i.priority === filterPriority);
    }

    return `
      <div class="kanban-col">
        <div class="kanban-col-header" style="background:${col.color};">
          ${col.label}
          <span class="col-count">${cards.length}</span>
        </div>
        <div class="kanban-cards" id="col-${col.id}"
          data-col="${col.id}"
          ondragover="onDragOver(event)"
          ondragleave="onDragLeave(event)"
          ondrop="onDrop(event, '${col.id}')">
          ${cards.length === 0
            ? '<div class="empty-state" style="padding:28px 10px;">No items</div>'
            : cards.map(card => renderCard(card, col)).join('')
          }
        </div>
      </div>
    `;
  }).join('');
}

function renderCard(issue, col) {
  const otherCols = KANBAN_COLUMNS.filter(c => c.id !== col.id);
  const moveBtns = otherCols.map(c =>
    `<button class="move-btn" onclick="moveCard('${issue.id}','${c.id}')">&#8594; ${c.label}</button>`
  ).join('');

  const pri = (issue.priority || '').toLowerCase();
  const date = issue.createdAt ? issue.createdAt.slice(0, 10) : '';

  return `
    <div class="issue-card" draggable="true"
      id="card-${issue.id}"
      ondragstart="onDragStart(event, '${issue.id}')"
      ondragend="onDragEnd(event)">
      <div class="card-actions">
        <button class="icon-btn edit" onclick="openIssueModal('${issue.id}')" title="Edit">&#9998;</button>
        <button class="icon-btn" onclick="deleteCard('${issue.id}')" title="Delete">&#10005;</button>
      </div>
      <h4>${escHtml(issue.title)}</h4>
      ${issue.description ? `<p>${escHtml(issue.description)}</p>` : ''}
      ${issue.comments ? `<p style="color:#555;border-left:3px solid #0066cc;padding-left:6px;margin-top:4px;">&#128172; ${escHtml(issue.comments)}</p>` : ''}
      ${issue.resolution ? `<p style="color:#1e8449;border-left:3px solid #28a745;padding-left:6px;margin-top:4px;">&#9989; ${escHtml(issue.resolution)}</p>` : ''}
      <div class="card-footer">
        ${issue.priority ? `<span class="priority-badge priority-${pri}">${issue.priority}</span>` : ''}
        ${issue.category ? `<span class="cat-badge">${escHtml(issue.category)}</span>` : ''}
        ${issue.assignee ? `<span style="font-size:11px;color:var(--text-muted);">&#128100; ${escHtml(issue.assignee)}</span>` : ''}
        ${issue.gameboard ? `<span style="font-size:11px;color:var(--text-muted);">&#127918; ${escHtml(issue.gameboard)}</span>` : ''}
        ${date ? `<span style="font-size:10px;color:var(--text-muted);margin-left:auto;">${date}</span>` : ''}
      </div>
      <div class="move-btns">${moveBtns}</div>
    </div>
  `;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== Drag & Drop ===== */
function onDragStart(event, id) {
  kanbanState.dragId = id;
  event.dataTransfer.effectAllowed = 'move';
  setTimeout(() => {
    const el = document.getElementById('card-' + id);
    if (el) el.classList.add('dragging');
  }, 0);
}

function onDragEnd(event) {
  document.querySelectorAll('.issue-card').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.kanban-cards').forEach(el => el.classList.remove('drag-over'));
}

function onDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.classList.add('drag-over');
}

function onDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

function onDrop(event, colId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if (kanbanState.dragId) {
    kanbanState.issues = moveIssue(kanbanState.dragId, colId);
    kanbanState.dragId = null;
    renderKanban();
  }
}

/* ===== Move via button ===== */
window.moveCard = function(id, colId) {
  kanbanState.issues = moveIssue(id, colId);
  renderKanban();
};

/* ===== Delete ===== */
window.deleteCard = function(id) {
  if (!confirm('Delete this issue?')) return;
  kanbanState.issues = deleteIssue(id);
  renderKanban();
};

/* ===== Add / Edit Modal ===== */
window.openIssueModal = function(id) {
  const form = document.getElementById('issue-form');
  form.reset();

  if (id) {
    const issue = kanbanState.issues.find(i => i.id === id);
    if (!issue) return;
    document.getElementById('issue-modal-title').textContent = 'Edit Issue';
    document.getElementById('issue-modal-submit').textContent = 'Update Issue';
    document.getElementById('issue-id').value = issue.id;
    document.getElementById('issue-title').value = issue.title || '';
    document.getElementById('issue-desc').value = issue.description || '';
    document.getElementById('issue-priority').value = issue.priority || '';
    document.getElementById('issue-category').value = issue.category || '';
    document.getElementById('issue-status').value = issue.status || 'backlog';
    document.getElementById('issue-assignee').value = issue.assignee || '';
    document.getElementById('issue-gameboard').value = issue.gameboard || '';
    document.getElementById('issue-comments').value = issue.comments || '';
    document.getElementById('issue-resolution').value = issue.resolution || '';
  } else {
    document.getElementById('issue-modal-title').textContent = 'Add Issue';
    document.getElementById('issue-modal-submit').textContent = 'Save Issue';
    document.getElementById('issue-id').value = '';
  }

  document.getElementById('issue-modal-overlay').classList.add('open');
};

function closeIssueModal() {
  document.getElementById('issue-modal-overlay').classList.remove('open');
}

function setupKanbanControls() {
  document.getElementById('btn-add-issue').addEventListener('click', () => openIssueModal(null));

  document.getElementById('issue-modal-cancel').addEventListener('click', closeIssueModal);
  document.getElementById('issue-modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('issue-modal-overlay')) closeIssueModal();
  });

  document.getElementById('issue-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = fd.get('id');
    const data = {
      title: fd.get('title').trim(),
      description: fd.get('description').trim(),
      priority: fd.get('priority'),
      category: fd.get('category'),
      status: fd.get('status') || 'backlog',
      assignee: fd.get('assignee').trim(),
      gameboard: fd.get('gameboard'),
      comments: fd.get('comments').trim(),
      resolution: fd.get('resolution').trim()
    };

    if (id) {
      kanbanState.issues = updateIssue(id, data);
    } else {
      kanbanState.issues = addIssue(data);
    }

    closeIssueModal();
    renderKanban();
  });

  // Search & filter
  document.getElementById('issue-search').addEventListener('input', e => {
    kanbanState.filterSearch = e.target.value;
    renderKanban();
  });
  document.getElementById('issue-filter-priority').addEventListener('change', e => {
    kanbanState.filterPriority = e.target.value;
    renderKanban();
  });

  // Sync to GitHub
  document.getElementById('btn-issues-sync').addEventListener('click', async () => {
    const btn = document.getElementById('btn-issues-sync');
    const status = document.getElementById('issues-sync-status');
    btn.disabled = true;
    status.textContent = '';
    const ok = await syncIssuesToGitHub(kanbanState.issues, msg => { status.textContent = msg; });
    btn.disabled = false;
    if (ok) setTimeout(() => { status.textContent = ''; }, 6000);
  });
}

// Init when tab is first clicked (lazy)
let kanbanInited = false;
document.querySelectorAll('nav.tabs button').forEach(btn => {
  if (btn.dataset.tab === 'tab-kanban') {
    btn.addEventListener('click', () => {
      if (!kanbanInited) { initKanban(); kanbanInited = true; }
    });
  }
});
