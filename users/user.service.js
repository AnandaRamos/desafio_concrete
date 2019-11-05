const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, senha }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(senha, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // valida usuário
    if (await User.findOne({ email: userParam.email })) {
        throw 'E-mail "' + userParam.email + '" já existente';
    }

    const user = new User(userParam);

    // hash senha
    if (userParam.senha) {
        user.hash = bcrypt.hashSync(userParam.senha, 10);
    }

    // salva usuário
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validada
    if (!user) throw 'Usuário e/ou senha inválidos';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'E-mail "' + userParam.email + '" já existente';
    }

    // hash senha
    if (userParam.senha) {
        userParam.hash = bcrypt.hashSync(userParam.senha, 10);
    }

    // copia userParam para usuario
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
