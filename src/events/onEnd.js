import { config } from "../config/config.js";
import { gameEnd } from "../db/user/user.db.js";
import { getGameSession } from "../session/game.session.js";
import { removeUser } from "../session/user.session.js";

export const onEnd = (socket) => async () => {
  console.log('Client disconnected');

  // 세션에서 유저 삭제
  const removedUser = removeUser(socket);

  // 게임 종료 시 유저 위치 저장
  await gameEnd(removedUser);

  // 게임 세션 삭제
  getGameSession(config.game.gameId).removeUser(removedUser.id);
};
