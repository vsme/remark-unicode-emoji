import { visit } from 'unist-util-visit';
import emojiMap from './emojis-json.js';

const RE_EMOJI = /:([\_a-z0-9\+\-\*\#]+):/gi;

const SETTINGS = {
    type: 'default',
};

export default function plugin(options) {
    const settings = Object.assign({}, SETTINGS, options);

    function toEmoji(unicode) {
      return unicode.split("-").map((codePointText) => String.fromCodePoint(Number.parseInt(codePointText, 16))).join("");
    }

    function getEmoji(match) {
      const key = match.slice(1, -1);
      let got = emojiMap[key];

      if (got && settings.type === 'default') {
          return toEmoji(got);
      }
      return got;
    }

    function transformer(tree) {
        visit(tree, 'text', function (node) {
          node.value = node.value.replace(RE_EMOJI, getEmoji);
        });
    }

    return transformer;
}