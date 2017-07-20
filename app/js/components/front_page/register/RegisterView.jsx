const React = require('react');
const RegisterOrgView = require('./RegisterOrgView');
const ActivateOrgView = require('./ActivateOrgView');

const RegisterView = ({
  currentView,
  register,
  registerFields,
  activateFields,
  onChange,
  onCreateOrganization,
  toLoginView,
  onRegister,
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
          register={register}
          onChange={onChange}
          onRegister={onRegister}
          toLoginView={toLoginView}
          onMount={onMount}
        />
      );
    default:
      return (<div />);
  }
};

module.exports = RegisterView;
