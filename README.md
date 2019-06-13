# RestfulAPI Practice

이 프로젝트는 RestFul API 연습 프로젝트입니다.

프로젝트는 Express Generator를 통해서 생성되었고, Express와 MongoDB를 통해서 개발되었습니다.

/app.js 에서 각종 세팅들과 DB연결을 해주었으며,
/routes/api/games/ 에서 라우터들을 관리했습니다.

GET , POST , PUT , DELETE 의 요청에 따라 기능을 달리하며 CRUD를 구현했습니다.

라우터에서는 프로미스 체인을 사용해서 비동기 방식으로 데이터를 확인, 반환합니다.
라우터에 대한 코드는 /routes/api/games 를 확인해주세요.