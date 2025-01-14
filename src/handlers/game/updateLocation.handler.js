import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { config } from '../../config/config.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    // 유저 좌표 보내준것을 받아서 객체 구조 분해 할당 
    const { x, y } = payload;

    // 게임 세션 가져오기
    const gameSession = getGameSession(config.game.gameId);
    console.log('updateLoactionHandler => gameSession : ', gameSession);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // userId가 undefined로 들어오는 현상 그래서 유저를 찾을 수 없음이 일어남
    console.log('updateLoactionHandler => userId : ', userId, `(x, y) => (${x}, ${y})`);
    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 유저 위치정보 업데이트
    user.updatePosition(x, y);
    // 접속한 모든 유저들에게 위치 정보 조회
    const packet = gameSession.getAllLocation(userId);

    // 게임 세션에 위치 정보 전송송
    socket.write(packet);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default updateLocationHandler;
