const React = require('react');
const RegisterOrgView = require('./RegisterOrgView');
const RegisterVerifyView = require('./RegisterVerifyView');
const views = require('views.json');

const RegisterView = ({currentView, register, onChange, onVerify, toLoginView, onRegister, toRegisterView}) => {
  let view;
  switch (currentView) {
    case views.REGISTER_VIEW:
    case views.REGISTER_ORGANIZATION_VIEW:
      view = (
        <RegisterOrgView
          register={register}
          onChange={onChange}
          onVerify={onVerify}
          toLoginView={toLoginView}
        />
      );
      break;
    case views.REGISTER_VERIFY_VIEW:
      view = (
        <RegisterVerifyView
          register={register}
          onChange={onChange}
          onRegister={onRegister}
          toRegisterView={toRegisterView}
        />
      );
      break;
  }
  return (
    <div>
      {view}
    </div>
  );
};

module.exports = RegisterView;
