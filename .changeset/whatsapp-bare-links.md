---
"@chat-adapter/whatsapp": patch
---

Send bare URLs, `www.` addresses, and email addresses as written in outgoing WhatsApp messages. They're no longer wrapped as `<url>` or rewritten as `[www.example.com](http://www.example.com)`, and formatting markers inside them, such as the underscores in `https://example.com/_private_/x`, are no longer escaped.
