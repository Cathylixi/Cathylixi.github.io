const LA_BOLA_NEGRA_SYNC = Object.freeze({
  documentId: '1ZmHusyTwdSitnl2HaLUqTQsEn716ooonFzdBeFNxafk',
  sourceUrl: 'https://raw.githubusercontent.com/Cathylixi/Cathylixi.github.io/main/_posts/2026-11-10-la-bola-negra-review.md',
  articleUrl: 'https://cathylixi.github.io/blog/la-bola-negra-review/',
  triggerFunction: 'syncLaBolaNegra',
});

/**
 * Pulls the canonical Markdown article from GitHub and rebuilds the target
 * Google Doc. The source is fetched and parsed before the document is cleared,
 * so a network or parsing failure cannot erase the existing document.
 */
function syncLaBolaNegra() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const response = UrlFetchApp.fetch(LA_BOLA_NEGRA_SYNC.sourceUrl, {
      followRedirects: true,
      muteHttpExceptions: true,
    });
    const status = response.getResponseCode();
    if (status !== 200) {
      throw new Error('GitHub returned HTTP ' + status + '.');
    }

    const parsed = parsePost_(response.getContentText('UTF-8'));
    if (!parsed.markdown || !parsed.metadata.paper_title) {
      throw new Error('The source article is missing required content.');
    }

    const doc = DocumentApp.openById(LA_BOLA_NEGRA_SYNC.documentId);
    const body = doc.getBody();
    body.clear();

    appendFrontMatter_(body, parsed.metadata);
    appendMarkdown_(body, parsed.markdown);
    appendSyncFooter_(body);

    body.editAsText().setFontFamily('Georgia');
    doc.saveAndClose();
  } finally {
    lock.releaseLock();
  }
}

/**
 * Runs the first sync and installs one hourly trigger. Run this function once
 * from the Apps Script editor after reviewing the requested permissions.
 */
function installHourlySync() {
  removeSyncTriggers_();
  syncLaBolaNegra();
  ScriptApp.newTrigger(LA_BOLA_NEGRA_SYNC.triggerFunction)
    .timeBased()
    .everyHours(1)
    .create();
}

/** Removes only triggers owned by this synchronizer. */
function uninstallHourlySync() {
  removeSyncTriggers_();
}

function removeSyncTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === LA_BOLA_NEGRA_SYNC.triggerFunction) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function parsePost_(source) {
  const normalized = source.replace(/\r\n/g, '\n');
  const frontMatterMatch = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontMatterMatch) {
    throw new Error('Could not parse the article front matter.');
  }

  return {
    metadata: parseSimpleYaml_(frontMatterMatch[1]),
    markdown: frontMatterMatch[2]
      .replace(/^<div[^>]*>\s*$/gm, '')
      .replace(/^<\/div>\s*$/gm, '')
      .trim(),
  };
}

function parseSimpleYaml_(yaml) {
  const result = {};
  let arrayKey = null;

  yaml.split('\n').forEach(function (line) {
    const arrayItem = line.match(/^\s+-\s+(.+)$/);
    if (arrayItem && arrayKey) {
      result[arrayKey].push(unquote_(arrayItem[1]));
      return;
    }

    const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!pair) return;

    const key = pair[1];
    const value = pair[2].trim();
    if (!value) {
      result[key] = [];
      arrayKey = key;
    } else {
      result[key] = unquote_(value);
      arrayKey = null;
    }
  });

  return result;
}

function unquote_(value) {
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function appendFrontMatter_(body, metadata) {
  body.appendParagraph(metadata.paper_title)
    .setHeading(DocumentApp.ParagraphHeading.TITLE);

  if (metadata.paper_subtitle) {
    body.appendParagraph(metadata.paper_subtitle)
      .setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  }

  if (metadata.subtitle) {
    const subtitle = body.appendParagraph(metadata.subtitle);
    subtitle.editAsText().setForegroundColor('#667278');
    subtitle.setSpacingAfter(14);
  }

  const notice = body.appendParagraph('AUTO-SYNCED FROM MY BLOG · WEBSITE IS THE SOURCE OF TRUTH');
  notice.editAsText()
    .setBold(true)
    .setFontSize(9)
    .setForegroundColor('#2c6764');
  notice.setSpacingAfter(18);

  if (metadata.abstract) {
    body.appendParagraph('Abstract')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    const abstract = body.appendParagraph(metadata.abstract);
    abstract.editAsText().setBackgroundColor('#dff1e5');
    abstract.setSpacingBefore(6).setSpacingAfter(12);
  }

  if (metadata.keywords && metadata.keywords.length) {
    body.appendParagraph('Keywords')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    const keywords = body.appendParagraph(metadata.keywords.join(' · '));
    keywords.editAsText().setForegroundColor('#707b80');
    keywords.setSpacingAfter(18);
  }

  body.appendHorizontalRule();
}

function appendMarkdown_(body, markdown) {
  const lines = markdown.split('\n');
  let paragraphBuffer = [];

  function flushParagraph() {
    if (!paragraphBuffer.length) return;
    body.appendParagraph(cleanInline_(paragraphBuffer.join(' ')));
    paragraphBuffer = [];
  }

  lines.forEach(function (line) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      return;
    }

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const levels = {
        2: DocumentApp.ParagraphHeading.HEADING1,
        3: DocumentApp.ParagraphHeading.HEADING2,
        4: DocumentApp.ParagraphHeading.HEADING3,
      };
      body.appendParagraph(cleanInline_(heading[2]))
        .setHeading(levels[heading[1].length]);
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph();
      const quote = body.appendParagraph(cleanInline_(trimmed.slice(2)));
      quote.editAsText().setItalic(true).setForegroundColor('#596166');
      quote.setIndentStart(24);
      return;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      body.appendListItem(cleanInline_(unordered[1]))
        .setGlyphType(DocumentApp.GlyphType.BULLET);
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
}

function cleanInline_(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function appendSyncFooter_(body) {
  body.appendHorizontalRule();
  const footer = body.appendParagraph(
    'Source: ' + LA_BOLA_NEGRA_SYNC.articleUrl + '\n' +
    'Last synchronized: ' + Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm z'
    )
  );
  footer.editAsText().setFontSize(9).setForegroundColor('#707b80');
}
