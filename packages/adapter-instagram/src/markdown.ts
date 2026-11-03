import {
  type AdapterPostableMessage,
  BaseFormatConverter,
  type Content,
  isLinkNode,
  type Link,
  paragraph,
  parseMarkdown,
  type Root,
  root,
  text,
  toPlainText,
  walkAst,
} from "chat";

/**
 * Instagram shows plain text, so a link keeps its URL as `label (url)`. GFM
 * parses a bare URL, `www.` address, or email address as a link whose text is
 * the address, and that address is sent as written.
 */
function linkToPlainText(node: Link): string {
  const label = toPlainText(root([paragraph(node.children)]));
  if (
    !label ||
    label === node.url ||
    node.url === `mailto:${label}` ||
    (label.startsWith("www.") && node.url === `http://${label}`)
  ) {
    return label || node.url;
  }
  return `${label} (${node.url})`;
}

export class InstagramFormatConverter extends BaseFormatConverter {
  fromAst(ast: Root): string {
    const transformed = walkAst(structuredClone(ast), (node: Content) =>
      isLinkNode(node) ? text(linkToPlainText(node)) : node
    );
    return toPlainText(transformed).trim();
  }

  toAst(text: string): Root {
    return parseMarkdown(text);
  }

  override renderPostable(message: AdapterPostableMessage): string {
    if (typeof message === "string") {
      return message;
    }
    if ("raw" in message) {
      return message.raw;
    }
    if ("markdown" in message) {
      return this.fromMarkdown(message.markdown);
    }
    if ("ast" in message) {
      return this.fromAst(message.ast);
    }
    return super.renderPostable(message);
  }
}
