module.exports = {
  privateKeyParser
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

  if (startMatch[1]) { //The key was declared with a title (title-----BEGIN RSA PRIVATE KEY-----)
    title = startMatch[1];
    content = content.substring(title.length);
  }


  state.tokens.push({
    type: 'privatekey',
    content: content,
    title,
    level: state.level,
  });

  state.line = currentLineIndex;

  return true;
}
