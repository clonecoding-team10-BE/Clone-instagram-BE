# Clone-Instagram-BE
🤘 항해99 클론코딩 프로젝트 10조 백앤드 협업 git 입니다.

## ✔프로젝트 소개
#### 인스타그램 클론 코딩🌈
✅ 게시글 전체 조회 및 수정, 삭제
</br>
  👉 게시글 작성 시 사진 파일 업로드 구현
</br>
✅ 댓글 전체 조회 및 작성, 삭제
</br>
✅ 좋아요 기능
</br>
  👉 한번 누르면 좋아요 체크, 한번 더 누르면 좋아요 삭제
</br>
✅ 회원가입
</br>
  👉 정규표현식, 중복 체크는 프론트엔드와 협의 후 결정 필수
  </br>
  👉 구현이 완료되면 비밀번호 암호화도 적용해보기!
</br>
✅ 무한스크롤
</br>
  👉 인스타그램 구현을 위해서 무한스크롤 기능 구현 예정
  
## ✔사용한 라이브러리
``` JS
npm i cookie-parser dotenv express sequelize jsonwebtoken mysql2 
npm i -D sequelize-cli nodemon
```
## ✔프로젝트 구조
```text
▼ clone-instagram-be
  ▼ config
      config.js
  ▼ middlewares
    auth-middleware.js
  ▼ migrations
    20230324041144-create-users.js
    20230324014446-create-posts.js
    20230324014447-create-comments.js
    20230324014449-create-likes.js
  ▼ models
    index.js
    posts.js
    users.js
    comment.js
    likes.js
  ▼ routes
    index.js
    comment.route.js
    post.route.js
    login.route.js
    signup.route.js
    like.route.js
  app.js
```
구현이 완료되면 3 Layer Architecture 패턴으로 수정 예정입니다.
</br>
❗❗ 일단 구현이 우선 ❗❗

## ✔협업 진행 시 지켜야 할 약속
무조건 남의 코드 긁어오는건 지양합니다!! 긁어올꺼면 코드 하나하나 설명할 수 있게 공부하기!!!!
</br>
작업 중 구현이 잘 안되거나 막힌다고 자책하지 않기!!
</br>
찾아보다가 도저히 해답이 안나올 때는 동료에게 질문하기!!
</br>
질문하는 동료한테 친절하게 답해주기
</br>
담당하게 된 작업이 생각보다 너무 어렵거나 스코프가 커진다고 느낀다면 언제든지 팀장과 상의해서 재분배하기!!
</br>
부수적인 기능보다는 메인 기능에 집중해서 완벽하게 구현하기

## ✔API 설계가 완료되면 추가적으로 해볼 것
에러핸들링 미들웨어 적용해서 에러핸들링하기
</br>
유저 정보에 대한 보안강화하기
</br>
swagger 적용해보기
