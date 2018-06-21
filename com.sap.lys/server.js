var approuter = require('@sap/approuter');

var ar = approuter();

ar.beforeRequestHandler.use(function myMiddleware(req, res, next) {
    next();
});

ar.start();