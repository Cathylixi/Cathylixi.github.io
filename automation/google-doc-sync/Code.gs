const BLOG_SYNC = Object.freeze({
  folderName: 'my blog',
  folderId: '1RgHOFjTeRDQyiMpZHkPNRjsUV9jFjp97',
  repositoryOwner: 'Cathylixi',
  repositoryName: 'Cathylixi.github.io',
  branch: 'main',
  tokenProperty: 'GITHUB_TOKEN',
  documentIdsProperty: 'BLOG_SYNC_DOCUMENT_IDS',
  reverseTriggerFunction: 'syncGoogleDocToGitHub',
  legacyTriggerFunction: 'syncLaBolaNegra',
  articles: Object.freeze([
    Object.freeze({
      key: 'when-ai-still-obeys',
      documentTitle: '当 AI 仍然服从，我们还握着方向盘吗？',
      articlePath: '_posts/2026-11-07-when-ai-still-obeys.md',
      titleField: 'title',
      subtitleField: 'subtitle',
      bodyStartsAtFirstPlainParagraph: true,
      outlineMode: 'none',
    }),
    Object.freeze({
      key: 'la-bola-negra',
      documentTitle: 'La Bola Negra',
      documentId: '1ZmHusyTwdSitnl2HaLUqTQsEn716ooonFzdBeFNxafk',
      articlePath: '_posts/2026-11-10-la-bola-negra-review.md',
      titleField: 'paper_title',
      subtitleField: 'paper_subtitle',
      legacySubtitleFromPrelude: true,
      outlineMode: 'from-heading',
      outlineHeadingPattern: '^## 2\\.\\s',
    }),
    Object.freeze({
      key: 'call-me-by-your-name',
      documentTitle: 'Call Me by Your Name',
      articlePath: '_posts/2026-11-11-call-me-by-your-name.md',
      titleField: 'paper_title',
      subtitleField: 'paper_subtitle',
      outlineMode: 'all',
    }),
    Object.freeze({
      key: 'when-the-state-refuses-to-remember',
      documentTitle: '当国家拒绝记忆：〈黑球〉中的家庭档案与责任转嫁',
      articlePath: '_posts/2026-11-11-when-the-state-refuses-to-remember.md',
      titleField: 'title',
      subtitleField: 'subtitle',
      bodyStartsAtFirstPlainParagraph: true,
      outlineMode: 'none',
    }),
  ]),
});

/**
 * Publishes every registered Google document to its canonical Markdown article.
 * The handler name is unchanged so existing time-based triggers keep working.
 */
function syncGoogleDocToGitHub() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const token = getGitHubToken_();
    const documentIds = getDocumentIds_();
    BLOG_SYNC.articles.forEach(function (article) {
      syncArticle_(token, article, resolveDocumentId_(article, documentIds));
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates missing Google Docs from the current Markdown articles and moves
 * every source document into My Drive/my blog. Safe to run repeatedly.
 */
function bootstrapBlogDocuments() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const token = getGitHubToken_();
    const folder = getBlogFolder_();
    const documentIds = getDocumentIds_();

    BLOG_SYNC.articles.forEach(function (article) {
      let documentId = resolveDocumentId_(article, documentIds, true);
      if (!documentId) {
        documentId = findDocumentInFolder_(folder, article.documentTitle);
      }

      if (!documentId) {
        const current = getGitHubArticle_(token, article);
        documentId = createGoogleDocFromPost_(article, current.content, folder);
        console.log(
          'Created Google Doc: ' + article.documentTitle +
          ' (https://docs.google.com/document/d/' + documentId + '/edit)'
        );
      } else {
        DriveApp.getFileById(documentId).moveTo(folder);
        console.log('Moved/reused Google Doc: ' + article.documentTitle);
      }

      documentIds[article.articlePath] = documentId;
    });

    saveDocumentIds_(documentIds);
    console.log('Blog document bootstrap complete.');
  } finally {
    lock.releaseLock();
  }
}

function installHourlyReverseSync() {
  removeSyncTriggers_();
  syncGoogleDocToGitHub();
  ScriptApp.newTrigger(BLOG_SYNC.reverseTriggerFunction)
    .timeBased()
    .everyHours(1)
    .create();
}

function installThirtyMinuteReverseSync() {
  removeSyncTriggers_();
  syncGoogleDocToGitHub();
  ScriptApp.newTrigger(BLOG_SYNC.reverseTriggerFunction)
    .timeBased()
    .everyMinutes(30)
    .create();
}

function uninstallAllSyncTriggers() {
  removeSyncTriggers_();
}

function removeSyncTriggers_() {
  const handlers = [
    BLOG_SYNC.legacyTriggerFunction,
    BLOG_SYNC.reverseTriggerFunction,
  ];

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (handlers.indexOf(trigger.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function syncArticle_(token, article, documentId) {
  const current = getGitHubArticle_(token, article);
  const parsed = splitPost_(current.content);
  const documentData = readGoogleDoc_(documentId, article);
  const frontMatter = updateFrontMatter_(
    parsed.frontMatter,
    documentData,
    article
  );
  const articleMarkdown = applyOutlineWrapper_(
    documentData.markdown.trim(),
    article
  );
  const nextContent = [
    '---',
    frontMatter.trim(),
    '---',
    '',
    articleMarkdown,
    '',
  ].join('\n');

  if (normalizeNewlines_(current.content) === normalizeNewlines_(nextContent)) {
    console.log('No document changes: ' + article.documentTitle);
    return;
  }

  updateGitHubArticle_(token, article, current.sha, nextContent);
}

function getGitHubToken_() {
  const token = PropertiesService.getScriptProperties()
    .getProperty(BLOG_SYNC.tokenProperty);
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN in Apps Script project properties.');
  }
  return token;
}

function getDocumentIds_() {
  const raw = PropertiesService.getScriptProperties()
    .getProperty(BLOG_SYNC.documentIdsProperty);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('BLOG_SYNC_DOCUMENT_IDS is not valid JSON.');
  }
}

function saveDocumentIds_(documentIds) {
  PropertiesService.getScriptProperties().setProperty(
    BLOG_SYNC.documentIdsProperty,
    JSON.stringify(documentIds)
  );
}

function resolveDocumentId_(article, documentIds, allowMissing) {
  const documentId = article.documentId || documentIds[article.articlePath] || '';
  if (!documentId && !allowMissing) {
    throw new Error(
      'No Google Doc is registered for ' + article.documentTitle +
      '. Run bootstrapBlogDocuments once.'
    );
  }
  return documentId;
}

function getBlogFolder_() {
  return DriveApp.getFolderById(BLOG_SYNC.folderId);
}

function findDocumentInFolder_(folder, documentTitle) {
  const files = folder.getFilesByName(documentTitle);
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_DOCS) return file.getId();
  }
  return '';
}

function createGoogleDocFromPost_(article, source, folder) {
  const parsed = splitPost_(source);
  const document = DocumentApp.create(article.documentTitle);
  populateGoogleDoc_(document, article, parsed.frontMatter, parsed.markdown);
  document.saveAndClose();

  const file = DriveApp.getFileById(document.getId());
  file.setDescription('Blog sync target: ' + article.articlePath);
  file.moveTo(folder);
  return document.getId();
}

function populateGoogleDoc_(document, article, frontMatter, markdown) {
  const body = document.getBody();
  body.clear();

  const primaryTitle = getYamlScalar_(frontMatter, article.titleField) ||
    getYamlScalar_(frontMatter, 'title') || article.documentTitle;
  body.appendParagraph(primaryTitle)
    .setHeading(DocumentApp.ParagraphHeading.TITLE);

  const primarySubtitle = getYamlScalar_(frontMatter, article.subtitleField) ||
    getYamlScalar_(frontMatter, 'subtitle') ||
    getYamlScalar_(frontMatter, 'summary');
  if (primarySubtitle) {
    body.appendParagraph(primarySubtitle)
      .setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  }

  if (article.legacySubtitleFromPrelude) {
    const pageSubtitle = getYamlScalar_(frontMatter, 'subtitle');
    if (pageSubtitle && pageSubtitle !== primarySubtitle) {
      body.appendParagraph(pageSubtitle);
    }
  }

  const abstract = getYamlScalar_(frontMatter, 'abstract');
  if (abstract) {
    body.appendParagraph('Abstract')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(abstract);
  }

  const keywords = getYamlList_(frontMatter, 'keywords');
  if (keywords.length) {
    body.appendParagraph('Keywords')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(keywords.join(' · '));
  }

  body.appendHorizontalRule();
  appendMarkdownToGoogleDoc_(body, stripOutlineWrapper_(markdown));
}

function appendMarkdownToGoogleDoc_(body, markdown) {
  normalizeNewlines_(markdown).trim().split('\n').forEach(function (rawLine) {
    const line = rawLine.trim();
    if (!line) return;

    let match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const headings = {
        2: DocumentApp.ParagraphHeading.HEADING1,
        3: DocumentApp.ParagraphHeading.HEADING2,
        4: DocumentApp.ParagraphHeading.HEADING3,
      };
      body.appendParagraph(match[2]).setHeading(headings[match[1].length]);
      return;
    }

    match = line.match(/^[-*]\s+(.+)$/);
    if (match) {
      body.appendListItem(match[1]).setGlyphType(DocumentApp.GlyphType.BULLET);
      return;
    }

    match = line.match(/^>\s?(.*)$/);
    if (match) {
      const paragraph = body.appendParagraph(match[1]);
      paragraph.editAsText().setItalic(true);
      return;
    }

    body.appendParagraph(line);
  });
}

function getGitHubArticle_(token, article) {
  const response = UrlFetchApp.fetch(gitHubContentsUrl_(article, true), {
    method: 'get',
    headers: gitHubHeaders_(token),
    muteHttpExceptions: true,
  });
  assertGitHubResponse_(response, [200], 'read ' + article.documentTitle);

  const payload = JSON.parse(response.getContentText('UTF-8'));
  return {
    sha: payload.sha,
    content: Utilities.newBlob(
      Utilities.base64Decode(payload.content.replace(/\s/g, ''))
    ).getDataAsString('UTF-8'),
  };
}

function updateGitHubArticle_(token, article, sha, content) {
  const response = UrlFetchApp.fetch(gitHubContentsUrl_(article, false), {
    method: 'put',
    contentType: 'application/json',
    headers: gitHubHeaders_(token),
    muteHttpExceptions: true,
    payload: JSON.stringify({
      message: 'Publish ' + article.documentTitle + ' from Google Docs',
      content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
      sha: sha,
      branch: BLOG_SYNC.branch,
    }),
  });
  assertGitHubResponse_(response, [200, 201], 'update ' + article.documentTitle);

  const payload = JSON.parse(response.getContentText('UTF-8'));
  console.log(
    'Published commit: ' + payload.commit.sha + ' [' + article.documentTitle + ']'
  );
}

function gitHubContentsUrl_(article, includeRef) {
  const url = 'https://api.github.com/repos/' +
    encodeURIComponent(BLOG_SYNC.repositoryOwner) + '/' +
    encodeURIComponent(BLOG_SYNC.repositoryName) + '/contents/' +
    article.articlePath.split('/').map(encodeURIComponent).join('/');
  return includeRef
    ? url + '?ref=' + encodeURIComponent(BLOG_SYNC.branch)
    : url;
}

function gitHubHeaders_(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: 'Bearer ' + token,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function assertGitHubResponse_(response, expected, action) {
  const status = response.getResponseCode();
  if (expected.indexOf(status) !== -1) return;

  const detail = response.getContentText('UTF-8').slice(0, 500);
  throw new Error(
    'GitHub could not ' + action + ' (HTTP ' + status + '): ' + detail
  );
}

function splitPost_(source) {
  const normalized = normalizeNewlines_(source);
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Could not parse the article front matter.');
  return {frontMatter: match[1], markdown: match[2]};
}

function readGoogleDoc_(documentId, article) {
  const body = DocumentApp.openById(documentId).getBody();
  const metadata = {keywords: []};
  const markdown = [];
  let inArticle = false;
  let captureAbstract = false;
  let captureKeywords = false;
  let preludeParagraphs = 0;

  for (let index = 0; index < body.getNumChildren(); index += 1) {
    const child = body.getChild(index);
    const type = child.getType();

    if (type === DocumentApp.ElementType.HORIZONTAL_RULE) {
      inArticle = true;
      captureAbstract = false;
      captureKeywords = false;
      continue;
    }
    if (type !== DocumentApp.ElementType.PARAGRAPH &&
        type !== DocumentApp.ElementType.LIST_ITEM) {
      continue;
    }

    const paragraph = type === DocumentApp.ElementType.LIST_ITEM
      ? child.asListItem()
      : child.asParagraph();
    const text = paragraph.getText().trim();
    if (!text) continue;
    if (text.indexOf('Source: https://cathylixi.github.io/') === 0) break;

    const heading = paragraph.getHeading();
    if (!inArticle) {
      if (heading === DocumentApp.ParagraphHeading.TITLE) {
        metadata[article.titleField] = text;
        continue;
      }
      if (heading === DocumentApp.ParagraphHeading.SUBTITLE) {
        metadata[article.subtitleField] = text;
        continue;
      }
      if (heading === DocumentApp.ParagraphHeading.HEADING1 &&
          text === 'Abstract') {
        captureAbstract = true;
        captureKeywords = false;
        continue;
      }
      if (heading === DocumentApp.ParagraphHeading.HEADING2 &&
          text === 'Keywords') {
        captureKeywords = true;
        captureAbstract = false;
        continue;
      }
      if (captureAbstract) {
        metadata.abstract = text;
        captureAbstract = false;
        continue;
      }
      if (captureKeywords) {
        metadata.keywords = text.split(/\s*[·•]\s*/).filter(String);
        captureKeywords = false;
        continue;
      }
      if (text.indexOf('AUTO-SYNCED FROM MY BLOG') === 0) continue;

      if (heading === DocumentApp.ParagraphHeading.HEADING1) {
        inArticle = true;
      } else if (article.bodyStartsAtFirstPlainParagraph) {
        inArticle = true;
      } else {
        preludeParagraphs += 1;
        if (article.legacySubtitleFromPrelude && preludeParagraphs === 1) {
          metadata.subtitle = text;
        }
        continue;
      }
    }

    const line = elementToMarkdown_(paragraph, type);
    if (line) markdown.push(line, '');
  }

  if (!inArticle) {
    throw new Error(
      'Could not find the article body in Google Doc: ' + article.documentTitle
    );
  }

  metadata.markdown = markdown.join('\n').replace(/\n{3,}/g, '\n\n');
  return metadata;
}

function elementToMarkdown_(paragraph, type) {
  const text = paragraph.getText().trim();
  const heading = paragraph.getHeading();
  const headingPrefixes = {};
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING1] = '## ';
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING2] = '### ';
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING3] = '#### ';

  if (headingPrefixes[heading]) return headingPrefixes[heading] + text;
  if (type === DocumentApp.ElementType.LIST_ITEM) {
    return '- ' + inlineMarkdown_(paragraph.editAsText());
  }

  const inline = inlineMarkdown_(paragraph.editAsText());
  if (isEntirelyItalic_(paragraph.editAsText())) {
    return '> ' + inline.replace(/^\*|\*$/g, '');
  }
  return inline;
}

function inlineMarkdown_(textElement) {
  const text = textElement.getText();
  if (!text) return '';

  const runs = [];
  const indices = textElement.getTextAttributeIndices();
  for (let index = 0; index < indices.length; index += 1) {
    const start = indices[index];
    const end = index + 1 < indices.length ? indices[index + 1] - 1 : text.length - 1;
    let chunk = text.slice(start, end + 1);
    const link = textElement.getLinkUrl(start);
    const bold = textElement.isBold(start);
    const italic = textElement.isItalic(start);

    if (link) chunk = '[' + chunk + '](' + link + ')';
    if (bold) chunk = '**' + chunk + '**';
    if (italic) chunk = '*' + chunk + '*';
    runs.push(chunk);
  }
  return runs.join('').trim();
}

function isEntirelyItalic_(textElement) {
  const text = textElement.getText();
  if (!text) return false;
  const indices = textElement.getTextAttributeIndices();
  return indices.length > 0 && indices.every(function (index) {
    return textElement.isItalic(index) === true;
  });
}

function updateFrontMatter_(frontMatter, documentData, article) {
  let yaml = frontMatter;
  yaml = replaceYamlScalar_(
    yaml,
    article.titleField,
    documentData[article.titleField]
  );
  yaml = replaceYamlScalar_(
    yaml,
    article.subtitleField,
    documentData[article.subtitleField]
  );
  yaml = replaceYamlScalar_(yaml, 'subtitle', documentData.subtitle);
  yaml = replaceYamlScalar_(yaml, 'abstract', documentData.abstract);

  if (documentData.keywords && documentData.keywords.length) {
    const keywordYaml = 'keywords:\n' + documentData.keywords.map(function (item) {
      return '  - ' + JSON.stringify(item);
    }).join('\n');
    yaml = yaml.replace(/^keywords:\n(?:  - .*\n?)*/m, keywordYaml + '\n');
  }
  return yaml;
}

function applyOutlineWrapper_(markdown, article) {
  if (!markdown || article.outlineMode === 'none') return markdown;
  if (article.outlineMode === 'all') {
    return [
      '<div class="academic-outline" markdown="1">',
      '',
      markdown,
      '',
      '</div>',
    ].join('\n');
  }

  if (article.outlineMode === 'from-heading') {
    const lines = markdown.split('\n');
    const pattern = new RegExp(article.outlineHeadingPattern);
    const start = lines.findIndex(function (line) { return pattern.test(line); });
    if (start === -1) {
      throw new Error(
        'Could not find the academic outline start in ' + article.documentTitle
      );
    }
    lines.splice(start, 0, '<div class="academic-outline" markdown="1">', '');
    lines.push('', '</div>');
    return lines.join('\n');
  }

  return markdown;
}

function stripOutlineWrapper_(markdown) {
  return normalizeNewlines_(markdown)
    .split('\n')
    .filter(function (line) {
      return line.trim() !== '<div class="academic-outline" markdown="1">' &&
        line.trim() !== '</div>';
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function getYamlScalar_(yaml, key) {
  const pattern = new RegExp('^' + escapeRegExp_(key) + ':\\s*(.*)$', 'm');
  const match = yaml.match(pattern);
  if (!match) return '';
  const raw = match[1].trim();
  if (!raw) return '';

  if ((raw[0] === '"' && raw[raw.length - 1] === '"') ||
      (raw[0] === "'" && raw[raw.length - 1] === "'")) {
    try {
      return raw[0] === '"' ? JSON.parse(raw) : raw.slice(1, -1);
    } catch (error) {
      return raw.slice(1, -1);
    }
  }
  return raw;
}

function getYamlList_(yaml, key) {
  const lines = normalizeNewlines_(yaml).split('\n');
  const start = lines.findIndex(function (line) {
    return line.trim() === key + ':';
  });
  if (start === -1) return [];

  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s+-\s+(.*)$/);
    if (!match) break;
    const raw = match[1].trim();
    try {
      values.push(raw[0] === '"' ? JSON.parse(raw) : raw.replace(/^'|'$/g, ''));
    } catch (error) {
      values.push(raw.replace(/^['"]|['"]$/g, ''));
    }
  }
  return values;
}

function replaceYamlScalar_(yaml, key, value) {
  if (!value) return yaml;
  const pattern = new RegExp('^' + escapeRegExp_(key) + ':.*$', 'm');
  if (!pattern.test(yaml)) return yaml;
  return yaml.replace(pattern, key + ': ' + JSON.stringify(value));
}

function escapeRegExp_(value) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function normalizeNewlines_(value) {
  return value.replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
}
