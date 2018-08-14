const tableRule = {
  filter: function(node) {
    if (node.nodeName === 'TABLE')
      return (
        node.firstChild.nodeName === 'TBODY' &&
        node.nodeName === 'TABLE' &&
        node.firstChild.firstChild.firstChild.nodeName === 'TD'
      );
  },
  replacement: function(content) {
    let divider = '';
    let table = content.split('\n');
    if (table[0] === '') table.shift();
    let [head, ...tail] = table;
    let header = head.split('|');
    for (let i = 0; i < header.length - 2; i++) {
      divider += '| --- ';
    }
    divider += '|';
    return head + '\n' + divider + '\n' + tail;
  }
};

const privateKeyRule = {
  filter: function(node) {
    return (
      node.nodeName === 'DIV' && node.className === 'rich-text-private-key'
    );
  },
  replacement: function(content) {
    return content;
  }
};

const copyRule = {
  filter: function(node) {
    return node.nodeName === 'DIV' && node.className === 'rich-text-copy';
  },
  replacement: function(content) {
    return `@copy@${content}@copy@`;
  }
};

const passwordRule = {
  filter: function(node) {
    return node.nodeName === 'DIV' && node.className === 'rich-text-password';
  },
  replacement: function(content) {
    return `@password@${content}@password@`;
  }
};

const documentLinkRule = {
  filter: function(node) {
    return node.nodeName === 'SPAN' && node.className === 'document-link';
  },
  replacement: function(content, node) {
    return `@link@${content}::${node.dataset.id}@link@`;
  }
};

export { tableRule, copyRule, privateKeyRule, passwordRule, documentLinkRule };
