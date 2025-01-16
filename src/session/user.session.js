import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

// 유저 세션에 유저객체 추가
export const addUser = (socket, userId, deviceId, playerId, latency) => {
  const user = new User(userId, socket, deviceId, playerId, latency);
  console.log('userSession => addUser : ', userId);
  userSessions.push(user);
  return user;
};

// 유저 세션에서 유저객체 삭제
export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

// DeviceId를 통한 유저 조회
export const getUserByDeviceId = (deviceId) => {
  return userSessions.find((user) => user.deviceId === deviceId);
};

// socket을 통해 유저 조회
export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
}