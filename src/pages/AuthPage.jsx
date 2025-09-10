import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="auth-page">
      <div className="container-fluid auth-container">
        <div className="row min-vh-100 g-0">
          {/* Panel izquierdo - Branding */}
          <div className="col-lg-6 col-md-12 d-none d-md-flex auth-brand-panel">
            <div className="auth-brand-content">
              <div className="brand-logo">
                <h1 className="brand-title">Degader Social</h1>
                <div className="brand-subtitle">Conectando corazones en fe</div>
              </div>

              <div className="brand-features">
                <div className="feature-item">
                  <div className="feature-icon">🙏</div>
                  <div className="feature-text">
                    <h4>Comunidad de Fe</h4>
                    <p>Conecta con hermanos en la fe de todo el mundo</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">❤️</div>
                  <div className="feature-text">
                    <h4>Amor y Apoyo</h4>
                    <p>Encuentra apoyo espiritual y emocional</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">📖</div>
                  <div className="feature-text">
                    <h4>Crecimiento Espiritual</h4>
                    <p>Comparte y aprende de experiencias de fe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formularios */}
          <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center auth-form-panel">
            <div className="auth-form-container">
              {isLogin ? (
                <LoginForm onSwitchToRegister={switchToRegister} />
              ) : (
                <RegisterForm onSwitchToLogin={switchToLogin} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
