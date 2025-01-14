import {
  createLocationPacket,
  gameStartNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 500;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'wating'; //wating, inprogress
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is Full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'wating';
    }
  }

  // 최대 레이턴시 값 조회
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';

    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(this.getMaxLatency());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation(userId) {
    // 최대 레이턴시 값 계산
    const maxLatency = this.getMaxLatency();

    const locationData = [];
    this.users.forEach((user) => {
      if (user.id !== userId) {
        const { x, y } = user.calculatePosition(maxLatency);
        locationData.push({ id: user.id, playerId: user.playerId, x, y });
      }
    });

    return createLocationPacket(locationData);
  }
}

export default Game;
