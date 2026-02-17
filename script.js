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
  var authUserAvatar = document.getElementById('auth-user-avatar');
  var authUserName = document.getElementById('auth-user-name');
  var authLogoutBtn = document.getElementById('auth-logout-btn');
  var authModalEmail = document.getElementById('auth-modal-email');
  var authModalPassword = document.getElementById('auth-modal-password');
  var btnModalClose = document.getElementById('auth-modal-close');
  var btnLogin = document.getElementById('auth-modal-btn-login');
  var btnSignup = document.getElementById('auth-modal-btn-signup');
  var btnGoogle = document.getElementById('auth-btn-google');
  var btnKakao = document.getElementById('auth-btn-kakao');

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
      var meta = user.user_metadata || {};
      var avatarUrl = meta.avatar_url;
      var displayName = meta.full_name || user.email || '사용자';
      if (authUserAvatar) {
        if (avatarUrl) {
          authUserAvatar.innerHTML = '<img src="' + avatarUrl + '" alt="" class="auth-user-avatar-img">';
        } else {
          authUserAvatar.innerHTML = '<i class="fa-solid fa-user-circle auth-user-avatar-icon" aria-hidden="true"></i>';
        }
      }
      if (authUserName) authUserName.textContent = displayName;
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
        var msg = (result.error.message || '').toLowerCase();
        if (msg.indexOf('already') !== -1 || msg.indexOf('registered') !== -1) {
          alert('이미 가입된 이메일입니다.\n로그인을 이용해 주세요.');
        } else if (msg.indexOf('email signups are disabled') !== -1 || msg.indexOf('signups are disabled') !== -1) {
          alert('이메일 회원가입이 비활성화되어 있습니다.\nSupabase 대시보드 → Authentication → Providers → Email 에서 "Enable Email Signup"을 켜 주세요.');
        } else {
          alert(result.error.message || '회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
        return;
      }
      alert('환영합니다! 가입이 완료되었습니다.');
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
        alert('로그인에 실패했습니다. 아이디/비밀번호를 확인하거나, 아직 회원이 아니시라면 [회원가입]을 진행해 주세요.');
        return;
      }
      alert('반갑습니다! 로그인되었습니다.');
      closeModal();
    });
  }

  function handleLogout() {
    if (supabase) supabase.auth.signOut();
  }

  function handleGoogleLogin() {
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다.');
      return;
    }
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent select_account'
        }
      }
    }).then(function (result) {
      if (result.error) {
        alert(result.error.message || 'Google 로그인에 실패했습니다.');
        return;
      }
      closeModal();
    });
  }

  function handleKakaoLogin() {
    if (!supabase) {
      alert('Supabase가 연결되지 않았습니다.');
      return;
    }
    supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        queryParams: {
          prompt: 'login'
        }
      }
    }).then(function (result) {
      if (result.error) {
        alert(result.error.message || '카카오 로그인에 실패했습니다.');
        return;
      }
      closeModal();
    });
  }

  if (btnOpenLogin) btnOpenLogin.addEventListener('click', openModal);
  if (btnGoogle) btnGoogle.addEventListener('click', handleGoogleLogin);
  if (btnKakao) btnKakao.addEventListener('click', handleKakaoLogin);
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
