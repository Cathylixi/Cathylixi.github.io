# La Bola Negra: Google Docs → GitHub sync

This Apps Script publishes the Google document `La Bola Negra` to the academic
article in this repository.

- Source document ID: `1ZmHusyTwdSitnl2HaLUqTQsEn716ooonFzdBeFNxafk`
- Target: `_posts/2026-11-10-la-bola-negra-review.md` on `main`
- Direction: Google Docs → GitHub only
- Schedule: hourly
- GitHub permission: fine-grained token restricted to this repository with
  **Contents: Read and write**

The synchronizer preserves the existing YAML front matter and the academic
outline wrapper. It updates the editable paper title, subtitle, abstract,
keywords, headings, paragraphs, links, emphasis, and lists from the document.
It creates a GitHub commit only when the generated article has changed.

## Installation

1. Create a fine-grained GitHub personal access token with access only to
   `Cathylixi/Cathylixi.github.io` and `Contents: Read and write` permission.
2. In the Apps Script project's **Project Settings → Script Properties**, add
   `GITHUB_TOKEN` with the token as its value.
3. Replace the Apps Script editor contents with `Code.gs` and save it.
4. Run `installHourlyReverseSync` once.
5. Confirm that the trigger page contains one hourly, time-based trigger for
   `syncGoogleDocToGitHub`.

Run `uninstallAllSyncTriggers` to remove both the former GitHub → Google Docs
trigger and the reverse trigger. Removing a trigger does not alter either the
Google Doc or the article.

## Editing contract

The Google Doc is the source of truth for article text. Keep the document's
heading levels intact:

- Heading 1 → `##`
- Heading 2 → `###`
- Heading 3 → `####`
- Google Docs lists → Markdown bullet lists
- Fully italicized paragraphs → blockquotes

The repository remains the source of truth for non-editorial Jekyll settings
such as layout, series, topics, visualization paths, and reading time.
