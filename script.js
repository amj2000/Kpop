(function () {
  'use strict';

  // ========== Supabase 설정 ==========
  const SUPABASE_URL = 'https://nksjbujftddladafntrq.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_kXOKx82MyeV2RsisCLe4yw_LJ2qpwvb';
  // ===================================

  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  var authModalBackdrop = document.getElementById('auth-modal-backdrop');
  var btnOpenLogin = document.getElementById('btn-open-login-modal');
  var authLoginWrap = document.getElementById('auth-login-wrap');
  var authUserWrap = document.getElementById('auth-user-wrap');
  var authWelcome = document.getElementById('auth-welcome-text');
  var authLogoutBtn = document.getElementById('auth-logout-btn');
  var authModalEmail = document.getElementById('auth-modal-email');
  var authModalPassword = document.getElementById('auth-modal-password');
  var btnModalClose = document.getElementById('auth-modal-close');
  var btnLogin = document.getElementById('auth-modal-btn-login');
  var btnSignup = document.getElementById('auth-modal-btn-signup');

  function openModal() {
    if (authModalBackdrop) {
      authModalBackdrop.classList.add('is-open');
      if (authModalEmail) authModalEmail.value = '';
      if (authModalPassword) authModalPassword.value = '';
    }
  }

  function closeModal() {
    if (authModalBackdrop) authModalBackdrop.classList.remove('is-open');
  }

  function updateAuthUI(user) {
    if (!authLoginWrap || !authUserWrap) return;
    if (user && user.email) {
      authLoginWrap.classList.add('hidden');
      authUserWrap.classList.remove('hidden');
      if (authWelcome) authWelcome.textContent = '환영합니다 ' + user.email + '님';
    } else {
      authLoginWrap.classList.remove('hidden');
      authUserWrap.classList.add('hidden');
    }
  }

  function initAuth() {
    if (!supabase) return;

    supabase.auth.onAuthStateChange(function (event, session) {
      updateAuthUI(session ? session.user : null);
    });

    supabase.auth.getSession().then(function (_ref) {
      var data = _ref.data;
      updateAuthUI(data.session ? data.session.user : null);
    });
  }

  function handleSignUp() {
    var email = authModalEmail && authModalEmail.value.trim();
    var password = authModalPassword && authModalPassword.value;
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다. script.js에서 URL과 Key를 설정해 주세요.');
      return;
    }
    supabase.auth.signUp({ email: email, password: password }).then(function (result) {
      if (result.error) {
        alert(result.error.message || '회원가입에 실패했습니다.');
        return;
      }
      alert('가입 확인 이메일을 보냈습니다. 메일함을 확인해 주세요.');
      closeModal();
    });
  }

  function handleLogin() {
    var email = authModalEmail && authModalEmail.value.trim();
    var password = authModalPassword && authModalPassword.value;
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다. script.js에서 URL과 Key를 설정해 주세요.');
      return;
    }
    supabase.auth.signInWithPassword({ email: email, password: password }).then(function (result) {
      if (result.error) {
        alert(result.error.message || '로그인에 실패했습니다.');
        return;
      }
      closeModal();
    });
  }

  function handleLogout() {
    if (supabase) supabase.auth.signOut();
  }

  if (btnOpenLogin) btnOpenLogin.addEventListener('click', openModal);
  if (btnModalClose) btnModalClose.addEventListener('click', closeModal);
  if (authModalBackdrop) {
    authModalBackdrop.addEventListener('click', function (e) {
      if (e.target === authModalBackdrop) closeModal();
    });
  }
  if (btnLogin) btnLogin.addEventListener('click', handleLogin);
  if (btnSignup) btnSignup.addEventListener('click', handleSignUp);
  if (authLogoutBtn) authLogoutBtn.addEventListener('click', handleLogout);

  initAuth();
})();
