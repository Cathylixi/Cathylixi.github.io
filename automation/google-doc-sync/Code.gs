const LA_BOLA_NEGRA_SYNC = Object.freeze({
  documentId: '1ZmHusyTwdSitnl2HaLUqTQsEn716ooonFzdBeFNxafk',
  repositoryOwner: 'Cathylixi',
  repositoryName: 'Cathylixi.github.io',
  branch: 'main',
  articlePath: '_posts/2026-11-10-la-bola-negra-review.md',
  tokenProperty: 'GITHUB_TOKEN',
  reverseTriggerFunction: 'syncGoogleDocToGitHub',
  legacyTriggerFunction: 'syncLaBolaNegra',
});

/**
 * Publishes the Google Doc to the canonical Markdown article on GitHub.
 *
 * The existing YAML front matter is retained. The editable title, subtitle,
 * abstract, keywords, and article body are rebuilt from the Google Doc. A new
 * GitHub commit is created only when the generated file is different.
 */
function syncGoogleDocToGitHub() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const token = PropertiesService.getScriptProperties()
      .getProperty(LA_BOLA_NEGRA_SYNC.tokenProperty);
    if (!token) {
      throw new Error(
        'Missing GITHUB_TOKEN in Apps Script project properties.'
      );
    }

    const current = getGitHubArticle_(token);
    const parsed = splitPost_(current.content);
    const documentData = readGoogleDoc_();
    const frontMatter = updateFrontMatter_(parsed.frontMatter, documentData);
    const nextContent = [
      '---',
      frontMatter.trim(),
      '---',
      '',
      documentData.markdown.trim(),
      '',
    ].join('\n');

    if (normalizeNewlines_(current.content) === normalizeNewlines_(nextContent)) {
      console.log('No document changes to publish.');
      return;
    }

    updateGitHubArticle_(token, current.sha, nextContent);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Runs the first reverse sync and installs one hourly Google Doc → GitHub
 * trigger. Run once after GITHUB_TOKEN has been added to Script Properties.
 */
function installHourlyReverseSync() {
  removeSyncTriggers_();
  syncGoogleDocToGitHub();
  ScriptApp.newTrigger(LA_BOLA_NEGRA_SYNC.reverseTriggerFunction)
    .timeBased()
    .everyHours(1)
    .create();
}

/** Removes both the former GitHub → Google Doc trigger and the reverse one. */
function uninstallAllSyncTriggers() {
  removeSyncTriggers_();
}

function removeSyncTriggers_() {
  const handlers = [
    LA_BOLA_NEGRA_SYNC.legacyTriggerFunction,
    LA_BOLA_NEGRA_SYNC.reverseTriggerFunction,
  ];

  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (handlers.indexOf(trigger.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function getGitHubArticle_(token) {
  const response = UrlFetchApp.fetch(gitHubContentsUrl_(true), {
    method: 'get',
    headers: gitHubHeaders_(token),
    muteHttpExceptions: true,
  });
  assertGitHubResponse_(response, [200], 'read the article');

  const payload = JSON.parse(response.getContentText('UTF-8'));
  return {
    sha: payload.sha,
    content: Utilities.newBlob(
      Utilities.base64Decode(payload.content.replace(/\s/g, ''))
    ).getDataAsString('UTF-8'),
  };
}

function updateGitHubArticle_(token, sha, content) {
  const response = UrlFetchApp.fetch(gitHubContentsUrl_(false), {
    method: 'put',
    contentType: 'application/json',
    headers: gitHubHeaders_(token),
    muteHttpExceptions: true,
    payload: JSON.stringify({
      message: 'Publish La Bola Negra from Google Docs',
      content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
      sha: sha,
      branch: LA_BOLA_NEGRA_SYNC.branch,
    }),
  });
  assertGitHubResponse_(response, [200, 201], 'update the article');

  const payload = JSON.parse(response.getContentText('UTF-8'));
  console.log('Published commit: ' + payload.commit.sha);
}

function gitHubContentsUrl_(includeRef) {
  const url = 'https://api.github.com/repos/' +
    encodeURIComponent(LA_BOLA_NEGRA_SYNC.repositoryOwner) + '/' +
    encodeURIComponent(LA_BOLA_NEGRA_SYNC.repositoryName) + '/contents/' +
    LA_BOLA_NEGRA_SYNC.articlePath.split('/').map(encodeURIComponent).join('/');
  return includeRef
    ? url + '?ref=' + encodeURIComponent(LA_BOLA_NEGRA_SYNC.branch)
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
  if (!match) {
    throw new Error('Could not parse the article front matter.');
  }
  return {frontMatter: match[1], markdown: match[2]};
}

function readGoogleDoc_() {
  const body = DocumentApp.openById(LA_BOLA_NEGRA_SYNC.documentId).getBody();
  const metadata = {keywords: []};
  const markdown = [];
  let inArticle = false;
  let outlineOpen = false;
  let captureAbstract = false;
  let captureKeywords = false;
  let normalParagraphIndex = 0;

  for (let index = 0; index < body.getNumChildren(); index += 1) {
    const child = body.getChild(index);
    const type = child.getType();

    if (type === DocumentApp.ElementType.HORIZONTAL_RULE) {
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

    if (text.indexOf('Source: https://cathylixi.github.io/') === 0) {
      break;
    }

    const heading = paragraph.getHeading();
    if (!inArticle) {
      if (heading === DocumentApp.ParagraphHeading.TITLE) {
        metadata.paperTitle = text;
        continue;
      }
      if (heading === DocumentApp.ParagraphHeading.SUBTITLE) {
        metadata.paperSubtitle = text;
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
      if (heading === DocumentApp.ParagraphHeading.HEADING1 &&
          /^1\.\s/.test(text)) {
        inArticle = true;
      } else if (captureAbstract) {
        metadata.abstract = text;
        captureAbstract = false;
        continue;
      } else if (captureKeywords) {
        metadata.keywords = text.split(/\s*[·•]\s*/).filter(String);
        captureKeywords = false;
        continue;
      } else if (text.indexOf('AUTO-SYNCED FROM MY BLOG') === 0) {
        continue;
      } else {
        normalParagraphIndex += 1;
        if (normalParagraphIndex === 1) metadata.subtitle = text;
        continue;
      }
    }

    if (heading === DocumentApp.ParagraphHeading.HEADING1 &&
        /^2\.\s/.test(text) && !outlineOpen) {
      markdown.push('<div class="academic-outline" markdown="1">', '');
      outlineOpen = true;
    }

    const line = elementToMarkdown_(paragraph, type);
    if (line) markdown.push(line, '');
  }

  if (!inArticle) {
    throw new Error('Could not find the Introduction heading in the Google Doc.');
  }
  if (outlineOpen) markdown.push('</div>', '');

  return {
    paperTitle: metadata.paperTitle || '',
    paperSubtitle: metadata.paperSubtitle || '',
    subtitle: metadata.subtitle || '',
    abstract: metadata.abstract || '',
    keywords: metadata.keywords,
    markdown: markdown.join('\n').replace(/\n{3,}/g, '\n\n'),
  };
}

function elementToMarkdown_(paragraph, type) {
  const text = paragraph.getText().trim();
  const heading = paragraph.getHeading();
  const headingPrefixes = {};
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING1] = '## ';
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING2] = '### ';
  headingPrefixes[DocumentApp.ParagraphHeading.HEADING3] = '#### ';

  if (headingPrefixes[heading]) {
    return headingPrefixes[heading] + text;
  }
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

function updateFrontMatter_(frontMatter, documentData) {
  let yaml = frontMatter;
  yaml = replaceYamlScalar_(yaml, 'paper_title', documentData.paperTitle);
  yaml = replaceYamlScalar_(yaml, 'paper_subtitle', documentData.paperSubtitle);
  yaml = replaceYamlScalar_(yaml, 'subtitle', documentData.subtitle);
  yaml = replaceYamlScalar_(yaml, 'abstract', documentData.abstract);

  if (documentData.keywords.length) {
    const keywordYaml = 'keywords:\n' + documentData.keywords.map(function (item) {
      return '  - ' + JSON.stringify(item);
    }).join('\n');
    yaml = yaml.replace(/^keywords:\n(?:  - .*\n?)*/m, keywordYaml + '\n');
  }
  return yaml;
}

function replaceYamlScalar_(yaml, key, value) {
  if (!value) return yaml;
  const pattern = new RegExp('^' + key + ':.*$', 'm');
  if (!pattern.test(yaml)) return yaml;
  return yaml.replace(pattern, key + ': ' + JSON.stringify(value));
}

function normalizeNewlines_(value) {
  return value.replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n';
}
