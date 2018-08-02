const findRemovedAttachments = require('./updateUtil');

test('Finds removed attachment', () => {
  const current = [{ id: '123' }, { id: '567' }, { id: '890' }];
  const attachments = [{ id: '123' }, { id: '567' }];
  const removed = findRemovedAttachments(current, attachments);
  expect(removed).toEqual([{ id: '890' }]);
});

test('Returns empty if nothing should be removed', () => {
  const current = [{ id: '123' }, { id: '567' }, { id: '890' }];
  const attachments = [{ id: '123' }, { id: '567' }, { id: '890' }];
  const removed = findRemovedAttachments(current, attachments);
  expect(removed.length).toBe(0);
  expect(removed).toEqual([]);
});
