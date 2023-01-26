const http = require("http");
const app = require("./app");

//Renvoi d'un port valide
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//Ajout du port de connection, s'il ni en a pas de déclaré, on écoutera le port 3000
const port = normalizePort(process.env.port || "3000");
app.set("port", port);

const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = 
        typeof address === "string" ? "pipe" + address : "port: " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + "requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + "is already in use.");
            process.exit(1);
            break;
        default: 
            throw error;
    }
};

//création du serveur via express
const server = http.createServer(app);

//Gestion serveur pour un retour console
server.on("error", errorHandler);
server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port: " + port;
    console.log("listening on" + bind);
});

//Ecoute du port défini plus haut
server.listen(port);