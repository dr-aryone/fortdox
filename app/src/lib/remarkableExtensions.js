module.exports = {
  privateKeyParser,
  copyParser,
  privateKeyRenderer,
  copyRenderer
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

function copyParser(state, silent) {
  const { src: currentLine } = state;
  const regexp = /@(copy|password)@(.*?)@(copy|password)@/g;
  let match = regexp.exec(currentLine.substring(state.pos));
  if (!match || match.index !== 0) return false;
  let content = match[2];
  state.pos += match[0].length;
  if (!silent) {
    state.push({
      type: 'copy',
      content: content,
      level: state.level,
      title: match[1]
    });
  }

  return true;
}

function privateKeyRenderer(tokens, idx, options) {
  debugger;
}

function copyRenderer(tokens) {
  return `<div className='copy' style='color: rgb(0, 0, 255);'>${
    tokens[0].content
  }</div>`;
}
