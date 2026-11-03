---
"@chat-adapter/instagram": patch
---

Keep link URLs in outgoing Instagram messages. A Markdown link such as `[the docs](https://example.com/docs)` is now sent as `the docs (https://example.com/docs)` instead of only its label. Bare URLs and email addresses are still sent as written.
