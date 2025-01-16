import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, deviceId, playerId, latency, lastX, lastY) {
    this.id = id;
    this.socket = socket;
    this.deviceId = deviceId;
    this.playerId = playerId;
    this.latency = latency;
    // 좌표
    this.x = lastX;
    this.y = lastY;
    
    this.startTime = Date.now();
    this.lastUpdateTime = Date.now();

    // 마지막 위치, 방향 계산을 위한 변수
    this.lastX = 0;
    this.lastY = 0;
    this.speed = 3;
  }

  // 좌표 업데이트트
  updatePosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = x;
    this.y = y;

    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping => ${now}`);
    this.socket.write(createPingPacket(now));
  }

  // 라운드 트립 레이턴시를 구하기 위하여 -> 클라 -> 서버로 보내준 것을 활용
  handlePong(data) {
    const now = Date.now();
    // 왕복이기에 /2 로 나누어서 계산
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received ping from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 위치 계산
  calculatePosition(latency) {
    // 이동이 없는 상황
    if(this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    // 초 단위
    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000; 
    // 예상 이동 거리 = 거속시
    const distance = this.speed * timeDiff;
    // 예상 방향
    const direcitonX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
    const direcitonY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

    return {
      x: this.x + direcitonX * distance,
      y: this.y + direcitonY * distance,
    };
  }
}

export default User;
