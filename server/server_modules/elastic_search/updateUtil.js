function findRemovedAttachments(current, attachments) {
  return current.filter(a => {
    const found = attachments.find(qa => qa.id === a.id);
    if (!found) {
      return a;
    }
  });
}

module.exports = findRemovedAttachments;
