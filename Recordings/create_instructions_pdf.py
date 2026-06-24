from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

OUTPUT = "/Users/patnn/Library/CloudStorage/OneDrive-PegasystemsInc/Claude projects/Experience web page/experience-dashboard/Recordings/Experience_Reset_Instructions.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.85*inch,
    rightMargin=0.85*inch,
    topMargin=0.85*inch,
    bottomMargin=0.85*inch,
)

styles = getSampleStyleSheet()
W = letter[0] - 1.7 * inch

# Custom styles
title_style = ParagraphStyle(
    "DocTitle", parent=styles["Title"],
    fontSize=22, leading=28, spaceAfter=6, textColor=colors.HexColor("#003087"),
)
subtitle_style = ParagraphStyle(
    "DocSubtitle", parent=styles["Normal"],
    fontSize=11, leading=14, spaceAfter=14, textColor=colors.HexColor("#555555"),
    alignment=TA_CENTER,
)
h1_style = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontSize=15, leading=18, spaceBefore=18, spaceAfter=6,
    textColor=colors.HexColor("#003087"),
    borderPad=4,
)
h2_style = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontSize=12, leading=14, spaceBefore=12, spaceAfter=4,
    textColor=colors.HexColor("#0057A8"),
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontSize=10, leading=14, spaceAfter=6,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=styles["Normal"],
    fontSize=10, leading=14, spaceAfter=4,
    leftIndent=16, bulletIndent=4,
    bulletFontName="Helvetica", bulletFontSize=10,
)
note_style = ParagraphStyle(
    "Note", parent=styles["Normal"],
    fontSize=9, leading=13, spaceAfter=6,
    leftIndent=12, rightIndent=12,
    backColor=colors.HexColor("#FFF8E1"),
    borderPad=6,
    textColor=colors.HexColor("#5D4037"),
)
code_style = ParagraphStyle(
    "Code", parent=styles["Normal"],
    fontSize=9, leading=13, spaceAfter=4,
    fontName="Courier", leftIndent=20,
    backColor=colors.HexColor("#F5F5F5"),
    borderPad=5, textColor=colors.HexColor("#1A1A1A"),
)
warn_style = ParagraphStyle(
    "Warn", parent=styles["Normal"],
    fontSize=9, leading=13, spaceAfter=6,
    leftIndent=12, rightIndent=12,
    backColor=colors.HexColor("#FFEBEE"),
    borderPad=6,
    textColor=colors.HexColor("#B71C1C"),
)

def hr():
    return HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CCCCCC"), spaceAfter=6)

def step_table(steps):
    """Render a numbered step table."""
    data = []
    for i, (title, detail) in enumerate(steps, 1):
        num_p = Paragraph(f"<b>{i}</b>", ParagraphStyle(
            "Num", parent=styles["Normal"], fontSize=11,
            textColor=colors.white, alignment=TA_CENTER,
        ))
        title_p = Paragraph(f"<b>{title}</b>", ParagraphStyle(
            "StepTitle", parent=styles["Normal"], fontSize=10, leading=13,
        ))
        detail_p = Paragraph(detail, ParagraphStyle(
            "StepDetail", parent=styles["Normal"], fontSize=9, leading=12,
            textColor=colors.HexColor("#444444"),
        ))
        data.append([num_p, [title_p, detail_p]])

    col_widths = [0.35*inch, W - 0.35*inch - 0.12*inch]
    tbl = Table(data, colWidths=col_widths, hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, -1), colors.HexColor("#0057A8")),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("ALIGN",         (0, 0), (0, -1), "CENTER"),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (1, 0), (1, -1), 10),
        ("RIGHTPADDING",  (1, 0), (1, -1), 4),
        ("ROWBACKGROUNDS",(0, 0), (-1, -1),
         [colors.HexColor("#E8F0FE"), colors.HexColor("#FFFFFF")]),
        ("BACKGROUND",    (0, 0), (0, -1), colors.HexColor("#0057A8")),
        ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
        ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
    ]))
    return tbl

# ── Build story ─────────────────────────────────────────────────────────────
story = []

# Cover
story.append(Spacer(1, 0.3*inch))
story.append(Paragraph("Experience Game Board", title_style))
story.append(Paragraph("Reset &amp; Setup Instructions", title_style))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph(
    "Walkthrough recorded 22 June 2026 · Wojciech Szeloch &amp; Aiswarya S",
    subtitle_style,
))
story.append(hr())
story.append(Spacer(1, 0.15*inch))

story.append(Paragraph(
    "This document covers the end-to-end procedure for resetting a Game Board before or between events, "
    "checking instance inventory, configuring the leaderboard, and setting up Infinity Studio "
    "GitHub Copilot credentials. Follow each section in order when preparing for a new event.",
    body_style,
))
story.append(Spacer(1, 0.2*inch))

# ── TOC-style summary box ────────────────────────────────────────────────────
toc_data = [
    [Paragraph("<b>#</b>", body_style), Paragraph("<b>Section</b>", body_style)],
    ["1", "Understanding the Demo Table & Scope Sets"],
    ["2", "Checking Instance Inventory"],
    ["3", "Running the Cleanup (Reset) Case"],
    ["4", "Leaderboard Configuration (config.js)"],
    ["5", "Infinity Studio – Copilot Account Mapping"],
    ["6", "Pre-Event Checklist"],
    ["7", "Credentials Quick Reference"],
]
toc = Table(toc_data, colWidths=[0.4*inch, W - 0.4*inch - 0.08*inch], hAlign="LEFT")
toc.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#003087")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.HexColor("#FFFFFF")]),
    ("FONTSIZE",      (0, 0), (-1, -1), 10),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(toc)
story.append(PageBreak())

# ── Section 1 ────────────────────────────────────────────────────────────────
story.append(Paragraph("1 · Understanding the Demo Table &amp; Scope Sets", h1_style))
story.append(hr())
story.append(Paragraph(
    "The <b>Demo Table</b> in the Game Board lists all available demos. By default, running the board "
    "without parameters shows all six demos. You can restrict visibility using a <b>scope</b> parameter "
    "that maps to a label (called a <i>set</i>) stored in <b>Demo Properties → Demo Features</b>.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

story.append(Paragraph("Defined sets", h2_style))
tbl = Table(
    [
        [Paragraph("<b>Set</b>", body_style), Paragraph("<b>Demos included</b>", body_style), Paragraph("<b>Typical use</b>", body_style)],
        ["set1", "Back Office, Customer Service, Infinity Studio", "Events showing these three experiences"],
        ["set2", "Single demo (e.g. Blueprint)", "Focused single-experience events"],
        ["(none)", "All six demos", "Full demo catalogue — default view"],
    ],
    colWidths=[0.75*inch, 2.8*inch, W - 3.55*inch - 0.08*inch],
    hAlign="LEFT",
)
tbl.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#0057A8")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.white]),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(tbl)
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("How to filter by set", h2_style))
story.append(step_table([
    ("Open the Game Board", "Navigate to the Game Board URL for the event (e.g. Gameboard 1, 2, or 3)."),
    ("Run without parameters", "You will see <i>all six demos</i> listed in the carousel."),
    ("Apply a scope filter", "Append <b>?scope=set1</b> (or <b>set2</b>) to the URL, or pass the <b>scope</b> parameter in the run configuration. Only the demos tagged with that label will appear."),
    ("Export before modifying", "Before removing demos from the Demo Table for a specific event, use the <b>Export</b> function to save the full table. Re-import after the event to restore all six demos."),
]))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph(
    "&#9888; Note: The <b>Blueprint</b> demo is not visible when using sets NBA and Agentic. "
    "Keep this in mind when choosing which set to activate.",
    note_style,
))

story.append(PageBreak())

# ── Section 2 ────────────────────────────────────────────────────────────────
story.append(Paragraph("2 · Checking Instance Inventory", h1_style))
story.append(hr())
story.append(Paragraph(
    "The <b>Check Inventory</b> case verifies that every Pega instance listed in the <b>Instance Table</b> "
    "is reachable and pointing to the correct Game Board URL via the Feedback Service application setting. "
    "Run this any time before an event.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

story.append(step_table([
    ("Open the Game Board admin panel",
     "Log in with <b>admin operator</b> credentials (see Section 7)."),
    ("Navigate to Check Inventory",
     "Click the <b>Check Inventory</b> case in the left navigation."),
    ("Review the results",
     "Each instance row shows: connectivity status, the Feedback Service URL it is configured with, "
     "and whether that URL matches the current Game Board. A green/connected status means the instance "
     "is up and correctly configured."),
    ("Fix misconfigured instances (optional)",
     "If an instance shows the wrong Feedback Service URL, tick the <b>Configure Automatically</b> "
     "checkbox and click <b>Submit</b>. The system will push the correct Game Board URL to every "
     "instance in the table. This is safe to run multiple times."),
    ("Add a new instance",
     "Add its hostname/URL row to the Instance Table, then re-run Check Inventory. "
     "Tick <b>Configure Automatically</b> to have the URL pushed automatically."),
]))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph(
    "&#9432; Scope: Check Inventory only validates instances that are explicitly listed in the "
    "Instance Table. There may be other instances pointing to this Game Board that are not shown here — "
    "but they are unlikely to cause issues because there will be no matching game/operator object for them.",
    note_style,
))

story.append(PageBreak())

# ── Section 3 ────────────────────────────────────────────────────────────────
story.append(Paragraph("3 · Running the Cleanup (Reset) Case", h1_style))
story.append(hr())
story.append(Paragraph(
    "The <b>Cleanup</b> case wipes all game results, scores, and player records from the Game Board "
    "database, returning it to a clean state. Run this before every new event.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

story.append(step_table([
    ("Open the Game Portal",
     "Navigate to the Game Portal page to see the current statistics (players, scores, records)."),
    ("Navigate to the Cleanup case",
     "In the admin panel, open the <b>Cleanup</b> case."),
    ("Select all records",
     "Check all checkboxes to select every result set you want to remove."),
    ("Submit",
     "Click <b>Submit</b>. The system will process the deletions. You may see a transient error message "
     "even on success — this is a known UI quirk."),
    ("Verify",
     "Refresh the Game Portal. All statistics (players, records, scores) should show <b>zero</b>. "
     "If values remain, wait a moment and refresh again, or re-run the cleanup."),
    ("Repeat for each Game Board",
     "If running multiple Game Boards (GB1, GB2, GB3), repeat these steps on each one using the "
     "same procedure."),
]))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph(
    "&#9888; Warning: This action is <b>irreversible</b>. Ensure you have exported any data you "
    "need to retain before running Cleanup.",
    warn_style,
))

story.append(PageBreak())

# ── Section 4 ────────────────────────────────────────────────────────────────
story.append(Paragraph("4 · Leaderboard Configuration (config.js)", h1_style))
story.append(hr())
story.append(Paragraph(
    "The leaderboard display is controlled by <b>6GXP / Scripts / config.js</b> in the file system. "
    "Edit this file to control which tabs, scores, and logos appear.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

story.append(Paragraph("Key configuration flags", h2_style))
conf_data = [
    [Paragraph("<b>Flag</b>", body_style),
     Paragraph("<b>Values</b>", body_style),
     Paragraph("<b>Effect</b>", body_style)],
    ["showGames", "true / false",
     "Shows individual per-game tabs on the leaderboard. Tabs are generated for every demo in the Demo Table."],
    ["showTeamScores", "true / false",
     "Displays the team score tab."],
    ["showPartnerScores", "true / false",
     "Displays partner organisation scores. Requires the 'partner' flag to be set on the relevant team rows in the Teams Table."],
    ["showOrganizationLogos", "true / false (default: false)",
     "Renders organisation logos next to team names. When false, a formatted square with the name is shown instead."],
]
tbl = Table(conf_data,
            colWidths=[1.5*inch, 1.1*inch, W - 2.6*inch - 0.08*inch],
            hAlign="LEFT")
tbl.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#0057A8")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.white]),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(tbl)
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("Restricting game tabs to event demos only", h2_style))
story.append(step_table([
    ("Export the full Demo Table",
     "Before making changes, export the Demo Table so you can restore it after the event."),
    ("Remove non-event demos",
     "Delete the rows for demos not being shown at this event from the Demo Table."),
    ("Set showGames = true in config.js",
     "The leaderboard will now show only tabs for the remaining demos."),
    ("Restore after the event",
     "Re-import the previously exported Demo Table to restore all six demo entries."),
]))

story.append(PageBreak())

# ── Section 5 ────────────────────────────────────────────────────────────────
story.append(Paragraph("5 · Infinity Studio – Copilot Account Mapping", h1_style))
story.append(hr())
story.append(Paragraph(
    "Infinity Studio creates a new player operator by <i>cloning</i> one of up to three "
    "<b>template operators</b> (Do Not Delete Me 1/2/3). Each template operator has a GitHub "
    "Copilot account pre-signed in. The cloned player operator inherits that Copilot session — "
    "players do <b>not</b> need to sign in themselves.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

story.append(Paragraph("DSS settings that control the loop", h2_style))
dss_data = [
    [Paragraph("<b>DSS key</b>", body_style),
     Paragraph("<b>Values</b>", body_style),
     Paragraph("<b>Effect</b>", body_style)],
    ["enableModelLoop", "true",
     "Cycles through model operators 1, 2, 3 in order for each new player created."],
    ["enableModelLoop", "false",
     "Always uses the single operator specified in modelLoopID."],
    ["modelLoopID", "1 / 2 / 3",
     "When loop is disabled, this is the only template operator used."],
]
tbl = Table(dss_data,
            colWidths=[1.5*inch, 0.9*inch, W - 2.4*inch - 0.08*inch],
            hAlign="LEFT")
tbl.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#0057A8")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.white]),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(tbl)
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("Instance configuration", h2_style))
inst_data = [
    [Paragraph("<b>Instances</b>", body_style),
     Paragraph("<b>Loop setting</b>", body_style),
     Paragraph("<b>Template operators</b>", body_style)],
    ["Infinity Studio 1 &amp; 2", "Enabled (3 accounts)",
     "Do Not Delete Me 1, 2, 3 — three different GitHub accounts"],
    ["Infinity Studio 3 &amp; 4", "Disabled (1 account)",
     "Single template operator only"],
]
tbl2 = Table(inst_data,
             colWidths=[1.6*inch, 1.5*inch, W - 3.1*inch - 0.08*inch],
             hAlign="LEFT")
tbl2.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#0057A8")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.white]),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(tbl2)
story.append(Spacer(1, 0.1*inch))

story.append(Paragraph("How to sign in / re-sign in a GitHub Copilot account", h2_style))
story.append(step_table([
    ("Check token usage",
     "In the GitHub account, go to <b>Settings → Copilot → Usage</b>. "
     "If consumption is near the limit, replace the account before the event."),
    ("Log in to the Infinity Studio instance",
     "Use operator: <b>do-not-delete-me-1</b> (or 2/3), password: <b>install12345!</b>"),
    ("Navigate to the Copilot sign-in page",
     "Find the Copilot settings page inside the instance. Copy the sign-in URL."),
    ("Sign in with the GitHub account",
     "Use SSO via the enterprise GitHub account. <b>This requires VPN</b> — complete this step "
     "before arriving at the event venue."),
    ("Verify connection",
     "Return to the Copilot status page and confirm the status shows <b>Connected</b>."),
    ("Repeat for each template operator",
     "If using three accounts (loop enabled), repeat for Do Not Delete Me 2 and 3."),
]))
story.append(Spacer(1, 0.08*inch))
story.append(Paragraph(
    "&#9888; VPN required: The GitHub enterprise SSO page is not accessible without Pega VPN. "
    "Complete all Copilot sign-in steps before travelling to the event venue.",
    warn_style,
))
story.append(Paragraph(
    "&#9432; The Reset Infinity Studio activity runs automatically each time a player starts the "
    "experience (when Start Game is clicked). It handles branch deletion and user story pre-population. "
    "You do not need to trigger it manually.",
    note_style,
))

story.append(PageBreak())

# ── Section 6 ────────────────────────────────────────────────────────────────
story.append(Paragraph("6 · Pre-Event Checklist", h1_style))
story.append(hr())
story.append(Paragraph(
    "Complete each item below before doors open. Tick off in order.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

checklist = [
    ("Game Board setup",
     [
         "Export the full Demo Table (backup).",
         "Remove demos not being shown; set the correct scope set.",
         "Run <b>Check Inventory</b> on all Game Boards (GB1, GB2, GB3).",
         "Run the <b>Cleanup</b> case on all Game Boards to zero out scores.",
         "Verify the Game Portal shows zero players and zero scores.",
     ]),
    ("Leaderboard",
     [
         "Edit <b>6GXP/Scripts/config.js</b> — set <b>showGames</b>, <b>showTeamScores</b>, "
         "<b>showPartnerScores</b>, <b>showOrganizationLogos</b> as needed.",
         "Mark partner organisations in the Teams Table if showPartnerScores is true.",
     ]),
    ("Infinity Studio Copilot (requires VPN — do before travel)",
     [
         "Check GitHub Copilot token usage for all three accounts.",
         "Re-sign in any account that is near its token limit.",
         "Verify each template operator shows <b>Connected</b> status.",
         "Confirm <b>enableModelLoop</b> and <b>modelLoopID</b> DSS settings match event scale.",
     ]),
    ("Game Board 3 (if using)",
     [
         "Confirm buddy-article ingestion is complete.",
         "Run a quick end-to-end test after ingestion.",
     ]),
]

for section, items in checklist:
    story.append(Paragraph(section, h2_style))
    for item in items:
        story.append(Paragraph(f"&#9723; &nbsp; {item}", bullet_style))
    story.append(Spacer(1, 0.06*inch))

story.append(PageBreak())

# ── Section 7 ────────────────────────────────────────────────────────────────
story.append(Paragraph("7 · Credentials Quick Reference", h1_style))
story.append(hr())
story.append(Paragraph(
    "The following credentials were shared during the walkthrough recording.",
    body_style,
))
story.append(Spacer(1, 0.08*inch))

cred_data = [
    [Paragraph("<b>System / Role</b>", body_style),
     Paragraph("<b>Username / Operator ID</b>", body_style),
     Paragraph("<b>Password</b>", body_style)],
    ["Game Board – Admin Operator", "admin operator", "install12345!"],
    ["Infinity Studio – Template Operator 1", "do-not-delete-me-1@n.pega.com", "install12345!"],
    ["Infinity Studio – Template Operator 2", "do-not-delete-me-2@n.pega.com", "install12345!"],
    ["Infinity Studio – Template Operator 3", "do-not-delete-me-3@n.pega.com", "install12345!"],
]
tbl = Table(cred_data,
            colWidths=[1.9*inch, 2.4*inch, W - 4.3*inch - 0.08*inch],
            hAlign="LEFT")
tbl.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#0057A8")),
    ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1),
     [colors.HexColor("#E8F0FE"), colors.white]),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 7),
    ("BOX",           (0, 0), (-1, -1), 0.5, colors.HexColor("#AAAAAA")),
    ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#CCCCCC")),
]))
story.append(tbl)
story.append(Spacer(1, 0.15*inch))
story.append(Paragraph(
    "&#9888; These credentials were shared in a recorded session. Rotate passwords after the event "
    "if the recording is distributed externally.",
    warn_style,
))

# ── Build ────────────────────────────────────────────────────────────────────
doc.build(story)
print(f"PDF written to: {OUTPUT}")
