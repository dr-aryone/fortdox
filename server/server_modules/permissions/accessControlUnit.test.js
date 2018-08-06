const permissions = require('app/permissions');
const acu = require('app/permissions/accessControlUnit');

test('User with INVITE_USER permission should be granted access to INVITE_USER feature', () => {
  const user = permissions.INVITE_USER;
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(true);
});

test('User with base permission should not be granted to INVITE_USER feature', () => {
  const user = permissions.BASE;
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(false);
});

test('User with INVIUTE_USER permission and REMOVE_DOCUMENT should be granted access to INVITE_USER feature', () => {
  const user = permissions.INVITE_USER | permissions.REMOVE_DOCUMENT;
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(true);
});

test('User with all regular permission should be granted access to INVITE_USER feature', () => {
  const user =
    permissions.INVITE_USER |
    permissions.REMOVE_DOCUMENT |
    permissions.REMOVE_USER;
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(true);
});

test('User with all regular permission except INVITE_USER must NOT be granted access to INVITE_USER feature', () => {
  const user = permissions.REMOVE_DOCUMENT | permissions.REMOVE_USER;
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(false);
});

test('User with string permission should not be allowed access', () => {
  const user = 'REMOVE_USER,INVITE_USER';
  const access = acu(user, permissions.INVITE_USER);
  expect(access).toBe(false);
});

test('user with negative permission number must not have access to anything', () => {
  const user = -1;
  let access = acu(user, permissions.invite_user);
  expect(access).toBe(false);

  access = acu(user, permissions.remove_document);
  expect(access).toBe(false);

  access = acu(user, permissions.remove_user);
  expect(access).toBe(false);

  access = acu(user, permissions.grant_permission);
  expect(access).toBe(false);
});

test('user with permission number outside max range must not have access to anything', () => {
  const user = 0xffff;
  let access = acu(user, permissions.invite_user);
  expect(access).toBe(false);

  access = acu(user, permissions.remove_document);
  expect(access).toBe(false);

  access = acu(user, permissions.remove_user);
  expect(access).toBe(false);

  access = acu(user, permissions.grant_permission);
  expect(access).toBe(false);
});

test('Edge case permissions', () => {
  let user = Number.MAX_VALUE;
  let access = acu(user, permissions.invite_user);
  expect(access).toBe(false);
  user = Number.MAX_SAFE_INTEGER;
  access = acu(user, permissions.invite_user);
  expect(access).toBe(false);
  user = Number.MIN_VALUE;
  access = acu(user, permissions.invite_user);
  expect(access).toBe(false);

  user = '4';
  access = acu(user, permissions.invite_user);
  expect(access).toBe(false);
});
