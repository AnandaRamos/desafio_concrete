const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // rotas que não necessitam de autenticação
            '/users/autenticar',
            '/users/registrar'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoga token se o usuário não existe mais
    if (!user) {
        return done(null, true);
    }

    done();
};
