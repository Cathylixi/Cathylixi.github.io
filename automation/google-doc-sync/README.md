# La Bola Negra → Google Docs sync

This Apps Script keeps the Google document `La Bola Negra` synchronized with
the canonical Markdown article in this repository.

- Source: `_posts/2026-11-10-la-bola-negra-review.md`
- Target document ID: `1ZmHusyTwdSitnl2HaLUqTQsEn716ooonFzdBeFNxafk`
- Direction: GitHub → Google Docs only
- Schedule: hourly
- Update policy: the target document body is rebuilt after the source has been
  fetched and parsed successfully

## Installation

1. Create a Google Apps Script project while signed in as the owner of the
   target document.
2. Paste `Code.gs` into the project and save it.
3. Run `installHourlySync` once.
4. Review and approve access to the target Google Doc, external requests, and
   time-driven triggers.

After installation, edits made directly in the Google Doc will be overwritten
by the next successful sync. Edit the Markdown source instead.

Run `uninstallHourlySync` to remove the hourly trigger without changing the
document.
