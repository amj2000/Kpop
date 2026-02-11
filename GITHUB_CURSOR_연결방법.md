# GitHub와 Cursor 연결 방법

## 1. Cursor에서 GitHub 계정 연결

1. **Cursor** 실행 후 왼쪽 아래 **톱니바퀴(설정)** 클릭
2. **Settings** → **Cursor Settings** 또는 **Account** 메뉴로 이동
3. **Sign in with GitHub** 선택 후 브라우저에서 GitHub 로그인 및 권한 허용
4. 연결되면 Cursor와 GitHub가 연동됩니다 (Clone, Push, 인증 등에서 사용)

또는:
- **명령 팔레트**: `Ctrl+Shift+P` → "GitHub: Sign in" 검색 후 실행

---

## 2. 이 프로젝트를 GitHub 저장소와 연결

현재 원격(remote) 주소: `https://github.com/USERNAME/Kpop.git`

### USERNAME을 본인 GitHub 아이디로 바꾸기

GitHub에서 **Kpop** 저장소를 만든 뒤, 아래에서 `YOUR_GITHUB_USERNAME`을 본인 아이디로 바꿉니다.

```powershell
cd c:\MyProject\Kpop
git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/Kpop.git
git remote -v
```

### GitHub에 저장소가 없다면

1. [github.com](https://github.com) 로그인
2. **+** → **New repository**
3. Repository name: **Kpop**
4. Public 선택, "Add a README" 등은 체크하지 않고 **Create repository**
5. 생성된 페이지의 URL을 복사 (예: `https://github.com/내아이디/Kpop.git`)
6. 터미널에서:

```powershell
cd c:\MyProject\Kpop
git remote set-url origin https://github.com/내아이디/Kpop.git
git push -u origin main
```

---

## 3. 한 번 연결 후 자주 쓰는 명령

- **푸시**: `git add .` → `git commit -m "메시지"` → `git push`
- **풀**: `git pull`
- Cursor 왼쪽 **Source Control** 아이콘에서도 커밋·푸시 가능

---

## 4. 인증이 안 될 때 (HTTPS)

- **GitHub 로그인**: 푸시 시 브라우저나 팝업으로 GitHub 로그인
- **Personal Access Token**: GitHub → Settings → Developer settings → Personal access tokens 에서 토큰 생성 후, 비밀번호 대신 토큰 입력

이렇게 하면 GitHub와 Cursor가 연결된 상태로 작업할 수 있습니다.
