# My Blog: Google Docs → GitHub sync

This Apps Script publishes every registered Google document in My Drive/my blog
to its canonical Markdown article in this repository.

| Google Doc | GitHub target |
| --- | --- |
| 当 AI 仍然服从，我们还握着方向盘吗？ | _posts/2026-11-07-when-ai-still-obeys.md |
| La Bola Negra | _posts/2026-11-10-la-bola-negra-review.md |
| Call Me by Your Name | _posts/2026-11-11-call-me-by-your-name.md |
| 当国家拒绝记忆：〈黑球〉中的家庭档案与责任转嫁 | _posts/2026-11-11-when-the-state-refuses-to-remember.md |

- Direction: Google Docs → GitHub only
- Commit behavior: a commit is created only when an article actually changes
- Existing trigger compatibility: the handler remains syncGoogleDocToGitHub
- GitHub permission: fine-grained token restricted to this repository with
  Contents: Read and write

The repository remains authoritative for Jekyll settings such as layout,
series, topics, visualization paths, dates, and reading time. Google Docs are
authoritative for editable titles/subtitles, abstract, keywords, and article
body text.

## One-time upgrade from the La Bola Negra-only sync

1. Replace the Apps Script editor contents with Code.gs and save it.
2. Run bootstrapBlogDocuments once.
   - The existing La Bola Negra document is moved into My Drive/my blog.
   - Missing documents are created from the current Markdown articles.
   - Generated document IDs are stored in the BLOG_SYNC_DOCUMENT_IDS Script
     Property, so later runs reuse the same documents.
3. Run syncGoogleDocToGitHub once and confirm that every article reports either
   No document changes or a published commit.
4. Existing time-based triggers continue working because the handler name did
   not change. To replace the schedule, run installThirtyMinuteReverseSync or
   installHourlyReverseSync once.

bootstrapBlogDocuments is idempotent: running it again reuses existing docs and
does not create duplicates.

## Editing contract

Keep the Google Docs heading levels intact:

- Title/Subtitle styles → configured front-matter title fields
- Heading 1 → Markdown level 2
- Heading 2 → Markdown level 3
- Heading 3 → Markdown level 4
- Google Docs lists → Markdown bullet lists
- Fully italicized paragraphs → blockquotes
- The horizontal rule separates document metadata from the article body

The academic outline wrappers used by La Bola Negra and Call Me by Your Name
are rebuilt automatically and should not be typed into Google Docs.

## Adding another article

Add one object to BLOG_SYNC.articles with a unique key, documentTitle,
articlePath, title/subtitle field names, and outline mode. Then run
bootstrapBlogDocuments once. No new trigger is needed.

## Removing synchronization

Run uninstallAllSyncTriggers to remove both the former single-article trigger
and the multi-article trigger. Removing a trigger does not alter Google Docs or
website articles.
