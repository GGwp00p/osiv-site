/**
 * OSiV — member profile form, built on the "OSiV — Team Profiles" Google Sheet.
 *
 * How to use (one time, ~2 minutes):
 *   1. Open the Google Sheet  →  Extensions  →  Apps Script.
 *   2. Delete the sample code, paste this whole file, click Save.
 *   3. Choose the function `setup` in the toolbar and click Run. Accept the permission prompt
 *      (it only needs access to this spreadsheet and Google Forms).
 *   4. Open the Execution log: it prints the form link to send to members and the edit link for you.
 *      The links are also written to the "Form links" tab.
 *
 * What it does:
 *   - converts the "Members" tab to English column names and English-order names (only if it still has the
 *     original Vietnamese seed header);
 *   - creates a Google Form (in English) whose answers go into a new "Form Responses" tab of this sheet;
 *   - only "Full name" and the consent question are required — every link (LinkedIn, ORCID, Scholar, …) is optional,
 *     and members can come back later with the same form and fill in what they skipped;
 *   - installs a trigger: each new answer is copied into the "Members" tab (matched by full name),
 *     overwriting only the fields the member actually filled in. The "Web group" and "Show (Y/N)" columns are yours.
 *   Run `setup` only once. To re-sync everything by hand, run `syncAllResponses`.
 */

var MEMBERS_SHEET = 'Members';

// Members-tab header  →  form question title (null = admin-only column)
var COLUMNS = [
  ['Full name', 'Full name'],
  ['Display name', 'Name to show on the website'],
  ['Web group', null],
  ['Division', 'Division'],
  ['Role', 'Role / title'],
  ['Research interests', 'Research interests / expertise (one line)'],
  ['Degree & affiliation', 'Degree & affiliation'],
  ['Photo link', 'Portrait photo link'],
  ['Website', 'Personal website'],
  ['Google Scholar', 'Google Scholar'],
  ['LinkedIn', 'LinkedIn'],
  ['ORCID', 'ORCID'],
  ['GitHub', 'GitHub'],
  ['ResearchGate', 'ResearchGate'],
  ['Facebook', 'Facebook'],
  ['Contact email (internal)', 'Contact email (internal only, not shown on the website)'],
  ['Public display consent', 'I agree that this information is shown on the OSiV website'],
  ['Show (Y/N)', null],
  ['Notes', 'Anything else? (optional)'],
  ['Last updated', null]
];

var DIVISIONS = ['Leadership', 'Research division', 'Operations — Media / Events / Partnerships', 'Design', 'Advisor'];
var CONSENT_YES = 'I agree';
var CONSENT_NO = 'I do not agree';

// Seed rows in English (replaces the first Vietnamese version of the Members tab).
var SEED = [
  // Full name, Web group, Division, Role, Research interests, Degree & affiliation
  ['An Thanh Nguyen Duong', 'lead', 'Leadership', 'CEO', 'digital transformation, innovation & public value', ''],
  ['Internal Manager', 'lead', 'Leadership', 'internal manager', 'profile coming soon', ''],
  ['Anh Dong Nguyen', 'lead', 'Leadership', 'quality checker (cross-department)', 'trade policy, applied AI', ''],
  ['Nhan Thanh Ho', 'research', 'Research division', 'research member · design', 'video understanding, episodic memory retrieval, graph learning', 'Faculty of Computer Science and Engineering, HCMUT'],
  ['Anh Ngoc Tu Trinh', 'research', 'Research division', 'research member', 'sustainable agriculture, water management', ''],
  ['Duy', 'research', 'Research division', 'member training program', 'research-methods curriculum', ''],
  ['Long', 'research', 'Research division', 'research member · media ambassador', '', ''],
  ['My', 'media', 'Operations — Media / Events / Partnerships', 'media lead · partnerships', '', ''],
  ['Trang', 'media', 'Operations — Media / Events / Partnerships', 'event lead · logistics', '', ''],
  ['My (junior)', 'media', 'Operations — Media / Events / Partnerships', 'media & events', '', ''],
  ['Vy', 'media', 'Operations — Media / Events / Partnerships', 'media & events', '', ''],
  ['Manh Phu Chu', 'design', 'Design', 'design', 'digital agriculture & traceability', ''],
  ['Dr. Thuan Duc Tran', 'advisor', 'Advisor', 'advisor (role to be confirmed)', '', 'Ho Chi Minh City University of Industry and Trade']
];
var SEED_NOTE = 'Seeded from the 06/11/2026 meeting minutes; waiting for the member to confirm via the form';

function setup() {
  var ss = SpreadsheetApp.getActive();
  migrateToEnglish_(ss);
  ensureMembersHeader_(ss);

  var form = FormApp.create('OSiV — Member profile');
  form.setDescription(
    'This information is used for the Team page of the OSiV website.\n' +
    'Only "Full name" and the consent question are required. All links (LinkedIn, ORCID, Google Scholar, …) are optional: ' +
    'leave them empty for now and come back to this form later to add them (use the same full name as before).');
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setProgressBar(false);

  form.addTextItem().setTitle(title_('Full name'))
      .setHelpText('Written in English order, without diacritics, as on your papers. Example: Nhan Thanh Ho').setRequired(true);
  form.addTextItem().setTitle(title_('Display name'))
      .setHelpText('Only if it differs from your full name. Leave empty to use your full name.');
  form.addMultipleChoiceItem().setTitle(title_('Division'))
      .setChoiceValues(DIVISIONS).showOtherOption(true);
  form.addTextItem().setTitle(title_('Role')).setHelpText('Example: Media Lead, Research member, Event Lead');
  form.addTextItem().setTitle(title_('Research interests'))
      .setHelpText('Short, in English. Example: video understanding, digital agriculture');
  form.addTextItem().setTitle(title_('Degree & affiliation')).setHelpText('Example: B.Eng. Computer Science, HCMUT');

  form.addSectionHeaderItem().setTitle('Photo & links (optional)')
      .setHelpText('Paste full links. Portrait photo: upload it to Google Drive, set sharing to "Anyone with the link", ' +
                   'then paste the link here. Landscape 16:9 or square, face centred.');
  form.addTextItem().setTitle(title_('Photo link'));
  form.addTextItem().setTitle(title_('Website')).setHelpText('https://…');
  form.addTextItem().setTitle(title_('Google Scholar')).setHelpText('https://scholar.google.com/citations?user=…');
  form.addTextItem().setTitle(title_('LinkedIn')).setHelpText('https://www.linkedin.com/in/…');
  form.addTextItem().setTitle(title_('ORCID')).setHelpText('https://orcid.org/0000-0000-0000-0000, or just the number');
  form.addTextItem().setTitle(title_('GitHub')).setHelpText('https://github.com/…');
  form.addTextItem().setTitle(title_('ResearchGate')).setHelpText('https://www.researchgate.net/profile/…');
  form.addTextItem().setTitle(title_('Facebook')).setHelpText('https://www.facebook.com/…');

  form.addSectionHeaderItem().setTitle('Contact & consent');
  form.addTextItem().setTitle(title_('Contact email (internal)'));
  form.addMultipleChoiceItem().setTitle(title_('Public display consent'))
      .setHelpText('Your name, role, photo and the links above will be public on the website. Your email will not be shown.')
      .setChoiceValues([CONSENT_YES, CONSENT_NO]).setRequired(true);
  form.addParagraphTextItem().setTitle(title_('Notes'));

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  ScriptApp.newTrigger('onMemberFormSubmit').forSpreadsheet(ss).onFormSubmit().create();

  var links = ss.getSheetByName('Form links') || ss.insertSheet('Form links');
  links.clear();
  links.getRange(1, 1, 3, 2).setValues([
    ['Form link for members', form.getPublishedUrl()],
    ['Form edit link (admin)', form.getEditUrl()],
    ['Created', new Date()]
  ]);
  links.setColumnWidth(1, 220);
  Logger.log('Form link for members: ' + form.getPublishedUrl());
  Logger.log('Edit link (admin):     ' + form.getEditUrl());
}

/** Replace the first (Vietnamese) version of the Members tab with the English seed. Runs only once. */
function migrateToEnglish_(ss) {
  var sh = ss.getSheetByName(MEMBERS_SHEET) || ss.getSheets()[0];
  var a1 = String(sh.getRange(1, 1).getValue()).trim();
  if (a1 === 'Full name') return;               // already English
  if (a1 !== 'Họ và tên') return;               // unknown layout: leave it alone
  sh.setName(MEMBERS_SHEET);
  sh.clearContents();
  var header = COLUMNS.map(function (c) { return c[0]; });
  var rows = SEED.map(function (s) {
    var r = header.map(function () { return ''; });
    r[header.indexOf('Full name')] = s[0];
    r[header.indexOf('Web group')] = s[1];
    r[header.indexOf('Division')] = s[2];
    r[header.indexOf('Role')] = s[3];
    r[header.indexOf('Research interests')] = s[4];
    r[header.indexOf('Degree & affiliation')] = s[5];
    r[header.indexOf('Show (Y/N)')] = 'Y';
    r[header.indexOf('Notes')] = SEED_NOTE;
    return r;
  });
  sh.getRange(1, 1, 1, header.length).setValues([header]);
  sh.getRange(2, 1, rows.length, header.length).setValues(rows);
}

function title_(header) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i][0] === header) return COLUMNS[i][1];
  throw new Error('Unknown column ' + header);
}

function ensureMembersHeader_(ss) {
  var sh = ss.getSheetByName(MEMBERS_SHEET);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(MEMBERS_SHEET);
  }
  var header = COLUMNS.map(function (c) { return c[0]; });
  var current = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  header.forEach(function (h) {
    if (current.indexOf(h) < 0) {
      sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
      current.push(h);
    }
  });
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  return sh;
}

/** Trigger: one new form answer → upsert into Members. */
function onMemberFormSubmit(e) {
  if (!e || !e.namedValues) return;
  upsert_(e.namedValues);
}

/** Manual: replay every answer in the responses tab (later answers win). */
function syncAllResponses() {
  var ss = SpreadsheetApp.getActive();
  var resp = ss.getSheets().filter(function (s) { return s.getFormUrl(); })[0];
  if (!resp) throw new Error('No form responses tab found — run setup first.');
  var values = resp.getDataRange().getValues();
  var head = values[0];
  for (var r = 1; r < values.length; r++) {
    var nv = {};
    head.forEach(function (h, i) { nv[h] = [values[r][i]]; });
    upsert_(nv);
  }
}

function upsert_(namedValues) {
  var ss = SpreadsheetApp.getActive();
  var sh = ensureMembersHeader_(ss);
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var get = function (q) { var v = namedValues[q]; return v ? String(v[0] || '').trim() : ''; };

  var name = get(title_('Full name'));
  if (!name) return;
  var nameCol = head.indexOf('Full name');
  var data = sh.getDataRange().getValues();
  var row = -1;
  for (var r = 1; r < data.length; r++) {
    if (norm_(data[r][nameCol]) === norm_(name)) { row = r + 1; break; }
  }
  if (row < 0) {
    row = sh.getLastRow() + 1;
    sh.getRange(row, head.indexOf('Show (Y/N)') + 1).setValue('Y');
  }
  COLUMNS.forEach(function (c) {
    if (!c[1]) return;
    var v = get(c[1]);
    if (v) sh.getRange(row, head.indexOf(c[0]) + 1).setValue(v);   // never wipe a field with a blank answer
  });
  sh.getRange(row, head.indexOf('Last updated') + 1).setValue(new Date());
}

/** Case-, spacing- and diacritic-insensitive name match ("Hồ Thành Nhân" == "ho thanh nhan"). */
function norm_(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * One-off for the form that already exists: adds the optional "Facebook" question right after "ResearchGate"
 * and the "Facebook" column in the Members tab. Run once from the Apps Script editor.
 */
function addFacebookQuestion() {
  var ss = SpreadsheetApp.getActive();
  ensureMembersHeader_(ss);
  var form = FormApp.openByUrl(ss.getFormUrl());
  var items = form.getItems();
  for (var i = 0; i < items.length; i++) if (items[i].getTitle() === title_('Facebook')) return;
  var fb = form.addTextItem().setTitle(title_('Facebook')).setHelpText('https://www.facebook.com/…');
  for (var j = 0; j < items.length; j++) {
    if (items[j].getTitle() === title_('ResearchGate')) { form.moveItem(fb.getIndex(), items[j].getIndex() + 1); break; }
  }
}
