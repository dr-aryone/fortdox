const React = require('react');
const RegisterOrgView = require('./RegisterOrgView');
const RegisterVerifyView = require('./RegisterVerifyView');
const views = require('views.json');

const RegisterView = ({currentView, register, onChange, onCreateOrganization, toLoginView, onRegister, onMount}) => {
  switch (currentView) {
    case views.REGISTER_VIEW:
    case views.REGISTER_ORGANIZATION_VIEW:
      return (
        <RegisterOrgView
          register={register}
          onChange={onChange}
          onCreateOrganization={onCreateOrganization}
          toLoginView={toLoginView}
        />
      );
    case views.REGISTER_VERIFY_VIEW:
      return (
        <RegisterVerifyView
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
