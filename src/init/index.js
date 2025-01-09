import pools from "../db/database.js";
import { testAllConnections } from "../utils/db/testConnection.js";
import { loadGameAssets } from "./assets.js";
import { createGameSession } from "./createGameSession.js";
import { loadProtos } from "./loadProtos.js";

const initServer = async () => {
    try{
        await loadGameAssets();
        await loadProtos();
        await testAllConnections(pools);
        createGameSession();
    } catch (e) {
        console.error('initServer Error : ', e);
        process.exit(1);
    }
}

export default initServer;