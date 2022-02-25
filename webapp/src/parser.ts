import { styleTags } from "@codemirror/highlight";
import { MarkdownConfig, TaskList } from "@lezer/markdown";
import { commonmark, mkLang } from "./markdown/markdown";
import * as ct from "./customtags";

const WikiLink: MarkdownConfig = {
  defineNodes: ["WikiLink", "WikiLinkPage"],
  parseInline: [
    {
      name: "WikiLink",
      parse(cx, next, pos) {
        let match: RegExpMatchArray | null;
        if (
          next != 91 /* '[' */ ||
          !(match = /^\[[^\]]+\]\]/.exec(cx.slice(pos + 1, cx.end)))
        ) {
          return -1;
        }
        return cx.addElement(
          cx.elt("WikiLink", pos, pos + match[0].length + 1, [
            cx.elt("WikiLinkPage", pos + 2, pos + match[0].length - 1),
          ])
        );
      },
      after: "Emphasis",
    },
  ],
};

const AtMention: MarkdownConfig = {
  defineNodes: ["AtMention"],
  parseInline: [
    {
      name: "AtMention",
      parse(cx, next, pos) {
        let match: RegExpMatchArray | null;
        if (
          next != 64 /* '@' */ ||
          !(match = /^[A-Za-z\.]+/.exec(cx.slice(pos + 1, cx.end)))
        ) {
          return -1;
        }
        return cx.addElement(
          cx.elt("AtMention", pos, pos + 1 + match[0].length)
        );
      },
      after: "Emphasis",
    },
  ],
};
const TagLink: MarkdownConfig = {
  defineNodes: ["Checkbox"],
  parseInline: [
    {
      name: "TagLink",
      parse(cx, next, pos) {
        let match: RegExpMatchArray | null;
        if (
          next != 35 /* '#' */ ||
          !(match = /^[A-Za-z\.]+/.exec(cx.slice(pos + 1, cx.end)))
        ) {
          return -1;
        }
        return cx.addElement(cx.elt("TagLink", pos, pos + 1 + match[0].length));
      },
      after: "Emphasis",
    },
  ],
};
const WikiMarkdown = commonmark.configure([
  WikiLink,
  AtMention,
  TagLink,
  TaskList,
  {
    props: [
      styleTags({
        WikiLink: ct.WikiLinkTag,
        WikiLinkPage: ct.WikiLinkPageTag,
        AtMention: ct.MentionTag,
        TagLink: ct.TagTag,
        Task: ct.TaskTag,
        TaskMarker: ct.TaskMarkerTag,
      }),
    ],
  },
]);

export default mkLang(WikiMarkdown);