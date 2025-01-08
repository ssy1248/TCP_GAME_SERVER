import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, deviceId, playerId, latency, lastX, lastY) {
    this.id = id;
    this.socket = socket;
    this.deviceId = deviceId;
    this.playerId = playerId;
    this.latency = latency;
    this.x = lastX;
    this.y = lastY;
    
    this.startTime = Date.now();
    this.lastUpdateTime = Date.now();

    this.lastX = 0;
    this.lastY = 0;
    this.speed = 3;
  }

  updatePosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = x;
    this.y = y;

    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received ping from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  calculatePosition(latency) {
    if(this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000; // 초 단위
    const distance = this.speed * timeDiff;
    const direcitonX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
    const direcitonY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

    return {
      x: this.x + direcitonX * distance,
      y: this.y + direcitonY * distance,
    };
  }
}

export default User;
