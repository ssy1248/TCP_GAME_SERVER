import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, userId, deviceId, playerId, latency) => {
  const user = new User(userId, socket, deviceId, playerId, latency);
  console.log('userSession => addUser : ', userId);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserByDeviceId = (deviceId) => {
  return userSessions.find((user) => user.deviceId === deviceId);
};

// export const getNextSequence = (id) => {
//   const user = getUserByDeviceId(id);
//   if (user) {
//     return user.getNextSequence();
//   }
//   return null;
// };

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
}