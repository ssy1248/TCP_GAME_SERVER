import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  // 패킷 타입 전체 조회
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    packet = Packet.decode(data);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const handlerId = packet.handlerId;
  const deviceId = packet.userId;
  const clientVersion = packet.version;

  //핸들러 id도 누락이 된건가? -> 0번인 이유가? -> INITIAL이라서 0?
  //공통 패킷 구조 -> payload가 누락되는 현상이 일어나는 거 같음
  console.log('공통 패킷 구조 : ', packet);

  console.log('패킷의 페이로드 : ', packet.payload);
  console.log('========');
  console.log(`handlerId : ${handlerId}`);
  console.log(`userId : ${deviceId}`);
  console.log(`clientVersion : ${clientVersion}`);
  console.log('========');

  // clientVersion 검증
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  console.log('프로토 타입 네임 : ', protoTypeName);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  //console.log('Payload Type : ', PayloadType); => 3개의 필드가 잘 들어가있음
  let payload;
  try {
    payload = PayloadType.decode(packet.payload);
    // 디코드를 할때 InitialPayload {} <= 빈값으로 디코드가 됨됨
    console.log('디코딩 된 페이로드 : ', payload);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }

  // 필드 검증 추가 = 중복이므로 코드 주석
  const errorMessage = PayloadType.verify(payload);
  if (errorMessage) {
    throw new CustomError(
      ErrorCodes.PACKET_STRUCTURE_MISMATCH,
      `패킷 구조가 일치하지 않습니다: ${errorMessage}`,
    );
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  console.log('필드1 : ', expectedFields);
  console.log('필드2 : ', actualFields);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, deviceId, payload };
};