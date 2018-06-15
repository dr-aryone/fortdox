module.exports = fields => fields.entrySeq().filter(([, value]) => value.get('value').trim() === '');
