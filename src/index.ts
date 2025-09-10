import express from "express"
import postgres from "postgres";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleWare, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerCountServerHit } from "./api/matrix.js";
import { handlerResetServerHit } from "./api/reset.js";
import { DBConfig } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
//  !!! import all chrps related from chiirp.js i have merged all of functions !!!
import { handlerChangeUserPass, handlerPostUser } from "./api/user.js";
import { handlerPostChirps, handlerGetChirps, handlerGetChirp, handlerValidateChip, handlerDeleteChirp } from "./api/chirp.js";
// import { handlerGetChirps } from "./api/getchirps.js";
// import { handlerGetChirp } from "./api/getChirp.js";
import { handlerLoginUser } from "./api/login.js";
import { handlerRefreshToken } from "./api/refresh.js";
import { handlerRevokeRefreshToken } from "./api/revoke.js";

const PORT = 8081

const migrationClient = postgres(DBConfig.url, { max: 1 });
await migrate(drizzle(migrationClient), DBConfig.migrationConfig);

const app = express();
app.use(express.json())
app.use(middlewareLogResponses, middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/admin/matrix", handlerCountServerHit);
app.get("/api/healthz", handlerReadiness);
app.get("/api/chirps", handlerGetChirps);
app.get('/api/chirps/:id', handlerGetChirp);

app.post('/api/login', handlerLoginUser);
app.post("/admin/reset", handlerResetServerHit);
app.post("/api/validate_chirp", handlerValidateChip);
app.post("/api/users", handlerPostUser);
app.post("/api/chirps", handlerPostChirps);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeRefreshToken);

app.put("/api/users",handlerChangeUserPass);
app.delete("/api/chirp/:chirpId",handlerDeleteChirp);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


app.use(errorMiddleWare);