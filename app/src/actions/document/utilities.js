import TurndownService from 'turndown';
import {
  tableRule,
  privateKeyRule,
  copyRule,
  documentLinkRule
} from 'lib/turndownExtensions';
const turndownPluginGfm = require('turndown-plugin-gfm');
const turndownService = new TurndownService({
  emDelimiter: '*',
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});
const gfm = turndownPluginGfm.gfm;
const tables = turndownPluginGfm.tables;
turndownService.use(gfm);
turndownService.use([tables]);
turndownService.addRule('table', tableRule);
turndownService.addRule('privateKey', privateKeyRule);
turndownService.addRule('copy', copyRule);
turndownService.addRule('documentLink', documentLinkRule);

const Remarkable = require('remarkable');
const {
  privateKeyParser,
  copyParser,
  documentLinkParser,
  privateKeyRenderer,
  copyRenderer,
  documentLinkRenderer
} = require('lib/remarkableExtensions');
const md = new Remarkable();
md.block.ruler.before('code', 'privatekey', privateKeyParser);
md.inline.ruler.push('copy', copyParser);
md.inline.ruler.push('documentLink', documentLinkParser);
md.renderer.rules.privatekey = privateKeyRenderer;
md.renderer.rules.copy = copyRenderer;
md.renderer.rules.documentLink = documentLinkRenderer;

export default { getPrefix, htmlToMarkdown, markdownToHtml };

export function getPrefix(currentView) {
  let view;
  let prefix;
  switch (currentView) {
    case 'UPDATE_DOC_VIEW':
      view = 'updateDocument';
      prefix = 'UPDATE_DOC';
      return { view, prefix };
    case 'CREATE_DOC_VIEW':
      view = 'createDocument';
      prefix = 'CREATE_DOC';
      return { view, prefix };
    case 'SEARCH_VIEW':
    case 'PREVIEW_DOC':
    default:
      view = 'previewDocument';
      prefix = 'PREVIEW_DOC';
      return { view, prefix };
  }
}

export function htmlToMarkdown(text) {
  return turndownService.turndown(text);
}

export function markdownToHtml(text) {
  return md.render(text);
}
