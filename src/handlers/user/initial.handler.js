import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createUser, findLastGameEndByUserId, findUserByDeviceId, updateUserLogin } from '../../db/user/user.db.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    console.log('[initial] deviceId, payload =>>> ', deviceId, payload);

    //MYSQL.user 테이블에서 deviceId를 통해서 유저 조회
    let user = await findUserByDeviceId(deviceId);

    let lastX = config.game.defaultX;
    let lastY = config.game.defaultY;

    if (!user) {
      // 등록된 유저가 없다면 유저 생성
      user = await createUser(deviceId);
    } else {
      // 유저의 마지막 로그인 업데이트
      await updateUserLogin(user.id);
    }

    const lastGameEndData = await findLastGameEndByUserId(user.id);
    console.log('Last Game Data : ', lastGameEndData);
    if(lastGameEndData) {
      lastX = lastGameEndData.x;
      lastY = lastGameEndData.y;
    }

    //(id, socket, deviceId, playerId, latency, lastX, lastY)
    let player = addUser(socket, user.id, user.deviceId, playerId, latency, lastX, lastY);

    const gameSession = getGameSession(config.game.gameId);
    gameSession.addUser(player);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id, x: lastX, y: lastY },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default initialHandler;