import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import createGameHandler from './game/createGame.handler.js';
import joinGameHandler from './game/joinGame.handler.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import initialHandler from './user/initial.handler.js';

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
  // [HANDLER_IDS.CREATE_GAME]: {
  //   handler: createGameHandler,
  //   protoType: 'game.CreateGamePayload',
  // },
  // [HANDLER_IDS.JOIN_GAME]: {
  //   handler: joinGameHandler,
  //   protoType: 'game.JoinGamePayload',
  // },
  [HANDLER_IDS.UPDATE_LOCATION]: {
    handler: updateLocationHandler,
    protoType: 'game.LocationUpdatePayload',
  }
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다. ID: ${handlerId}`);
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  // packetParser에서 이미 throw로 에러를 체크 하기에 아래 예외처리는 없어도 문제가 생기진 않는다.(이미 packetParser에서 검출이 되기때문에)
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다. ID: ${handlerId}`);
  }
  return handlers[handlerId].protoType;
};
