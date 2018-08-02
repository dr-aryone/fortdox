module.exports = {
  privateKeyParser,
  copyParser,
  documentLinkParser,
  privateKeyRenderer,
  copyRenderer,
  documentLinkRenderer
};

function privateKeyParser(state, startLine, endLine) {
  let currentLine = state.getLines(startLine, startLine + 1, 1);
  let startMatch = /(.*)?-----BEGIN RSA PRIVATE KEY-----/.exec(currentLine);

  if (!startMatch) return false;

  let currentLineIndex = startLine + 1;
  let foundEndMatch;

  while (currentLineIndex < endLine && !foundEndMatch) {
    currentLine = state.getLines(currentLineIndex, currentLineIndex + 1, 1);
    let endMatch = /-----END RSA PRIVATE KEY-----/.exec(currentLine);
    if (endMatch) {
      foundEndMatch = true;
    }
    currentLineIndex++;
  }

  if (!foundEndMatch) {
    return false;
  }

  let content = state.getLines(startLine, currentLineIndex);
  let title = '';

  if (startMatch[1]) {
    //The key was declared with a title (title-----BEGIN RSA PRIVATE KEY-----)
    title = startMatch[1];
    content = content.substring(title.length);
  }

  state.tokens.push({
    type: 'privatekey',
    content: content,
    title,
    level: state.level
  });

  state.line = currentLineIndex;

  return true;
}

function checkMatching(regexp, state) {
  let { src: currentLine } = state;
  let match = regexp.exec(currentLine.substring(state.pos));
  if (!match || match.index !== 0) return false;
  return { title: match[1], content: match[2], length: match[0].length };
}

function matchingParser(regexp, state) {
  const res = checkMatching(regexp, state);
  if (!res) return false;
  state.pos += res.length;
  return res;
}

function copyParser(state, silent) {
  if (silent) return false;

  const regexp = /@(copy|password)@(.*?)@(copy|password)@/g;

  const result = matchingParser(regexp, state);
  if (!result) return false;

  state.push({
    type: 'copy',
    content: result.content,
    level: state.level,
    title: result.title
  });

  return true;
}

function documentLinkParser(state, silent) {
  if (silent) return false;
  const regexp = /@(link)@(.*?)@(link)@/g;

  const result = matchingParser(regexp, state);
  if (!result) return false;

  state.push({
    type: 'documentLink',
    name: result.content.split('::')[0],
    id: result.content.split('::')[1],
    level: state.level,
    title: result.title
  });

  return true;
}

function privateKeyRenderer(tokens) {
  return `<div class'rich-text-private-key'>${tokens[0].title}${
    tokens[0].content
  }</div>`;
}

function copyRenderer(tokens) {
  return `<div class='rich-text-copy'>${tokens[0].content}</div>`;
}

function documentLinkRenderer(tokens) {
  return `<span class='document-link' data-id='${tokens[0].id}'>${
    tokens[0].name
  }</span>`;
}
