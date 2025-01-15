import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserByDeviceId, getUserBySocket } from '../session/user.session.js';
import { handlerError } from '../utils/error/errorHandler.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { getProtoMessages } from '../init/loadProtos.js';

export const onData = (socket) => async (data) => {
  // 기존 버퍼에 새로 수신된 데이터를 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  // 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
  while (socket.buffer.length >= totalHeaderLength) {
    // 1. 패킷 길이 정보 수신 (4바이트)
    const length = socket.buffer.readUInt32BE(0);

    // 2. 패킷 타입 정보 수신 (1바이트)
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);
    // 3. 패킷 전체 길이 확인 후 데이터 수신
    if (socket.buffer.length >= length) {
      
      if (packetType !== PACKET_TYPE.PING) {
        console.log(`### [ onData ] length: ${length}, packetType: ${packetType}`);
      }

      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.subarray(totalHeaderLength, length);
      socket.buffer = socket.buffer.subarray(length);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING: {
            const protoMessage = getProtoMessages();
            const Ping = protoMessage.common.Ping;
            const pingMessage = Ping.decode(packet);
            const user = getUserBySocket(socket);
            if(!user) {
              throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
            }
            user.handlePong(pingMessage);

            break;
          }
          case PACKET_TYPE.NORMAL:
            const { handlerId, deviceId, payload } = packetParser(packet);

            const user = getUserByDeviceId(deviceId);
            let userId;

            if(user) {
              userId = user.id;

              console.log(
                ' [onData getUserByDeviceId] deviceId: ',
                deviceId,
                ' userId =>> ',
                userId,
              );
            }

            const handler = getHandlerById(handlerId);
            await handler({ socket, userId, payload });

            console.log('[ packet Parser ] ======================= ');
            console.log(`handlerId: ${handlerId}`);
            console.log(`deviceId: ${deviceId}`);
            console.log(`payload: ${payload}`);
            console.log('[ packet Parser ] ======================= ');

            break;
        }
      } catch (error) {
        handlerError(socket, error);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};