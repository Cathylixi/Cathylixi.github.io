# Cathy Li Xi website workflow

## Article publishing

Treat every website article as a two-destination publication:

1. Store and update the website source in `_posts/`.
2. Build and verify the Jekyll site before publishing.
3. Create or update the matching Google Doc in the user's Google Drive during the same task.
4. Use the article's displayed website title as the Google Doc title. Prefer `paper_title`, then fall back to `title`.
5. Copy the article metadata and readable body into the Google Doc, but omit Jekyll front matter and implementation-only markup.
6. Search Drive for an existing document with the same canonical title before creating a new one, so revisions update the existing document instead of producing duplicates.
7. Keep the website and Google Doc content aligned when an article title or body changes.
8. If Google Drive is not connected or write access is unavailable, do not claim the article workflow is complete. Finish the safe website work, then clearly ask the user to connect Drive so the pending document can be synchronized.

This Google Drive synchronization is the default for all future article additions and edits unless the user explicitly asks for a website-only draft.
