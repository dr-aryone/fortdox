const React = require('react');
const RegisterOrgView = require('./RegisterOrgView');
const ActivateOrgView = require('./ActivateOrgView');
const VerifyOrgLinkView = require('./VerifyOrgLinkView');

const RegisterView = ({
  currentView,
  register,
  message,
  activationCode,
  isVerified,
  verifyFields,
  registerFields,
  activateFields,
  onChange,
  onCreateOrganization,
  toLoginView,
  onRegister,
  onVerifyCode,
  onMount
}) => {
  switch (currentView) {
    case 'REGISTER_VIEW':
    case 'REGISTER_ORGANIZATION_VIEW':
      return (
        <RegisterOrgView
          registerFields={registerFields}
          register={register}
          onChange={onChange}
          onCreateOrganization={onCreateOrganization}
          toLoginView={toLoginView}
        />
      );
    case 'ACTIVATE_ORGANIZATION_VIEW':
      return (
        <ActivateOrgView
          activateFields={activateFields}
          isVerified={isVerified}
          register={register}
          onChange={onChange}
          onRegister={onRegister}
          toLoginView={toLoginView}
          onMount={onMount}
        />
      );
    case 'VERIFY_ORGANIZATION_VIEW':
      return (
        <VerifyOrgLinkView
          verifyFields={verifyFields}
          register={register}
          message={message}
          activationCode={activationCode}
          onChange={onChange}
          onVerifyCode={onVerifyCode}
          toLoginView={toLoginView}
        />
      );
    default:
      return <div />;
  }
};

module.exports = RegisterView;
