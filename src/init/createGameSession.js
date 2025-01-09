import { config } from '../config/config.js';
import { addGameSession } from '../session/game.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

export const createGameSession = () => {
  try {
    // 게임 세션 생성 (지금은 확인 용으로 고정으로 하고 나중에 생성하고 그 게임 세션을 가져오는 것으로 변경을 하자)
    const gameSession = addGameSession(config.game.gameId);
    console.log('게임 세션 생성 완료 : ', gameSession);
  } catch (e) {
    console.error('게임 세션 생성 실패 : ', e);
  }
};
