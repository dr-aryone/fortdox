const React = require('react');
const VerifyUserView = require('./VerifyUserView');
const VerifyInviteView = require('./VerifyInviteView');

const InviteView = ({
  currentView,
  uuid,
  temporaryPassword,
  fields,
  error,
  isLoading,
  privateKey,
  onSubmit,
  onMount,
  onChange,
  toLoginView,
  onVerifyUser
}) => {
  switch (currentView) {
    case 'INVITE_VIEW':
    case 'VERIFY_INVITE_VIEW':
      return (
        <VerifyInviteView
          uuid={uuid}
          temporaryPassword={temporaryPassword}
          error={error}
          isLoading={isLoading}
          onChange={onChange}
          toLoginView={toLoginView}
          onVerifyUser={onVerifyUser}
        />
      );
    case 'VERIFY_USER_VIEW':
      return (
        <VerifyUserView
          fields={fields}
          privateKey={privateKey}
          isLoading={isLoading}
          error={error}
          onSubmit={onSubmit}
          onMount={onMount}
          onChange={onChange}
          toLoginView={toLoginView}
        />
      );
    default:
      return <div />;
  }
};

module.exports = InviteView;
