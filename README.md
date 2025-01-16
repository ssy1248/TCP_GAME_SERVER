## Node.js를 통한 TCP 게임 서버 개발
``` txt
유니티 클라이언트를 이용한 간단한 멀티 플레이어 접속 구현
```

## 파일 구조

``` txt
📦src
 ┣ 📂classes
 ┃ ┣ 📂managers
 ┃ ┃ ┣ 📜base.manager.js
 ┃ ┃ ┗ 📜interval.manager.js
 ┃ ┗ 📂models
 ┃ ┃ ┣ 📜game.class.js
 ┃ ┃ ┗ 📜user.class.js
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📜env.js
 ┃ ┣ 📜handlerIds.js
 ┃ ┗ 📜header.js
 ┣ 📂db
 ┃ ┣ 📂migration
 ┃ ┃ ┗ 📜createSchemas.js
 ┃ ┣ 📂sql
 ┃ ┃ ┗ 📜user_db.sql
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜user.db.js
 ┃ ┃ ┗ 📜user.querires.js
 ┃ ┗ 📜database.js
 ┣ 📂events
 ┃ ┣ 📜onConnection.js
 ┃ ┣ 📜onData.js
 ┃ ┣ 📜onEnd.js
 ┃ ┗ 📜onError.js
 ┣ 📂handlers
 ┃ ┣ 📂game
 ┃ ┃ ┣ 📜createGame.handler.js
 ┃ ┃ ┣ 📜joinGame.handler.js
 ┃ ┃ ┗ 📜updateLocation.handler.js
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜initial.handler.js
 ┃ ┗ 📜index.js
 ┣ 📂init
 ┃ ┣ 📜assets.js
 ┃ ┣ 📜createGameSession.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜loadProtos.js
 ┣ 📂protobuf
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.proto
 ┃ ┣ 📂request
 ┃ ┃ ┣ 📜common.proto
 ┃ ┃ ┣ 📜game.proto
 ┃ ┃ ┗ 📜initial.proto
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜response.proto
 ┃ ┗ 📜packetNames.js
 ┣ 📂session
 ┃ ┣ 📜game.session.js
 ┃ ┣ 📜sessions.js
 ┃ ┗ 📜user.session.js
 ┣ 📂utils
 ┃ ┣ 📂db
 ┃ ┃ ┗ 📜testConnection.js
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜customError.js
 ┃ ┃ ┣ 📜errorCodes.js
 ┃ ┃ ┗ 📜errorHandler.js
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.js
 ┃ ┣ 📂parser
 ┃ ┃ ┗ 📜packetParser.js
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜createResponse.js
 ┃ ┣ 📜dateFormatter.js
 ┃ ┗ 📜transformCase.js
 ┗ 📜server.js
```

### 필수 구현 기능

## 유저 접속
``` txt
유저 접속 구현 : game.class.js
유저 접속 실행 : initial.handler.js
```

### 도전 구현 기능

## DB 연동
