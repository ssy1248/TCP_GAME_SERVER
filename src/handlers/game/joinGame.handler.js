import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession, getAllGameSessions } from '../../session/game.session.js';
import { getUserByDeviceId } from '../../session/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinGameHandler = ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;
    const gameSession = getGameSession(gameId);

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    const user = getUserByDeviceId(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }
    const existUser = gameSession.getUser(user.id);
    if (!existUser) {
      gameSession.addUser(user);
    }

    console.log(getAllGameSessions());

    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임에 참가했습니다.' },
      user.id,
    );
    socket.write(joinGameResponse);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default joinGameHandler;
