/* ===== Overview Tab ===== */

const CHART_COLORS = ['#0066cc','#0099cc','#28a745','#f0a500','#7b2d8b','#dc3545','#6c757d','#003a70'];

let overviewCharts = {};

function destroyChart(id) {
  if (overviewCharts[id]) { overviewCharts[id].destroy(); delete overviewCharts[id]; }
}

function makeChart(id, config) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if (!ctx) return;
  overviewCharts[id] = new Chart(ctx, config);
}

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function renderOverview() {
  const engagements = loadEngagements();
  const issues = loadIssues();
  const totalInstances = INSTANCES_DATA.reduce((s, g) => s + g.instances.length, 0);

  // ===== Stat Cards =====
  const backlog = issues.filter(i => i.status === 'backlog').length;
  const inprog  = issues.filter(i => i.status === 'inprogress').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const critical = issues.filter(i => i.priority === 'Critical').length;

  const stats = [
    { label: 'Total Instances',    value: totalInstances,       icon: '&#128202;', color: '#0066cc' },
    { label: 'Total Engagements',  value: engagements.length,   icon: '&#128197;', color: '#0099cc' },
    { label: 'Open Issues',        value: backlog + inprog,      icon: '&#128204;', color: '#f0a500' },
    { label: 'Critical Issues',    value: critical,              icon: '&#128680;', color: '#dc3545' },
    { label: 'Resolved Issues',    value: resolved,              icon: '&#9989;',   color: '#28a745' },
    { label: 'Gameboards',         value: INSTANCES_DATA.length, icon: '&#127918;', color: '#7b2d8b' },
  ];

  document.getElementById('overview-stats').innerHTML = stats.map(s => `
    <div class="card" style="display:flex;align-items:center;gap:14px;padding:18px 20px;">
      <div style="font-size:28px;">${s.icon}</div>
      <div>
        <div style="font-size:26px;font-weight:800;color:${s.color};">${s.value}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">${s.label}</div>
      </div>
    </div>
  `).join('');

  // ===== Chart: Engagements by Type =====
  const byType = countBy(engagements, 'type');
  makeChart('chart-eng-type', {
    type: 'doughnut',
    data: {
      labels: Object.keys(byType),
      datasets: [{ data: Object.values(byType), backgroundColor: CHART_COLORS, borderWidth: 2 }]
    },
    options: { plugins: { legend: { position: 'right' } }, cutout: '60%' }
  });

  // ===== Chart: Engagements by Gameboard =====
  const byGB = countBy(engagements, 'gameboard');
  makeChart('chart-eng-gameboard', {
    type: 'bar',
    data: {
      labels: Object.keys(byGB),
      datasets: [{
        label: 'Engagements',
        data: Object.values(byGB),
        backgroundColor: CHART_COLORS,
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { maxRotation: 30, font: { size: 11 } } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  // ===== Chart: Issues by Status =====
  const statusMap = { backlog: 'Backlog', inprogress: 'In Progress', resolved: 'Resolved' };
  const statusColors = { backlog: '#6b7a99', inprogress: '#f0a500', resolved: '#28a745' };
  const byStatus = countBy(issues, 'status');
  makeChart('chart-issues-status', {
    type: 'doughnut',
    data: {
      labels: Object.keys(byStatus).map(k => statusMap[k] || k),
      datasets: [{
        data: Object.values(byStatus),
        backgroundColor: Object.keys(byStatus).map(k => statusColors[k] || '#aaa'),
        borderWidth: 2
      }]
    },
    options: { plugins: { legend: { position: 'right' } }, cutout: '60%' }
  });

  // ===== Chart: Issues by Priority =====
  const priColors = { Critical: '#dc3545', High: '#f0a500', Medium: '#ffc107', Low: '#28a745' };
  const byPri = countBy(issues, 'priority');
  const priOrder = ['Critical', 'High', 'Medium', 'Low'];
  const priLabels = priOrder.filter(p => byPri[p]);
  makeChart('chart-issues-priority', {
    type: 'bar',
    data: {
      labels: priLabels,
      datasets: [{
        label: 'Issues',
        data: priLabels.map(p => byPri[p] || 0),
        backgroundColor: priLabels.map(p => priColors[p] || '#aaa'),
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });

  // ===== Chart: Engagements Timeline =====
  const monthCounts = {};
  engagements.forEach(e => {
    if (!e.date) return;
    const ym = e.date.slice(0, 7); // YYYY-MM
    monthCounts[ym] = (monthCounts[ym] || 0) + 1;
  });
  const sortedMonths = Object.keys(monthCounts).sort();
  makeChart('chart-eng-timeline', {
    type: 'line',
    data: {
      labels: sortedMonths.map(m => {
        const [y, mo] = m.split('-');
        return new Date(y, mo - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
      }),
      datasets: [{
        label: 'Engagements',
        data: sortedMonths.map(m => monthCounts[m]),
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0,102,204,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0066cc'
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

// Refresh overview whenever its tab is clicked
document.querySelectorAll('nav.tabs button').forEach(btn => {
  if (btn.dataset.tab === 'tab-overview') {
    btn.addEventListener('click', renderOverview);
  }
});

// Also render on initial load (it's the default active tab)
document.addEventListener('DOMContentLoaded', renderOverview);
