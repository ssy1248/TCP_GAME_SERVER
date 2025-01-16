import pools from "../db/database.js";
import { testAllConnections } from "../utils/db/testConnection.js";
import { loadGameAssets } from "./assets.js";
import { createGameSession } from "./createGameSession.js";
import { loadProtos } from "./loadProtos.js";

// 서버 시작 시 작동
const initServer = async () => {
    try{
        // 게임 에셋 로드
        await loadGameAssets();
        // proto 파일 로드
        await loadProtos();
        // db 연결 테스트
        //await testAllConnections(pools);
        // 게임 세션 생성
        createGameSession();
    } catch (e) {
        console.error('initServer Error : ', e);
        process.exit(1);
    }
}

export default initServer;