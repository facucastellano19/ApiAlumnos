const { decode } = require('../utils/jwt')

function checkRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (req.headers.authorization) {
      const data = decode(req.headers.authorization);
      if (data && rolesPermitidos.includes(data.user_rol_id)) {
        req.user_id = data.user_id;
        req.user_rol_id = data.user_rol_id;
        return next();
      }
    }
    const error = new Error("Privilegios insuficientes");
    error.status = 401;
    next(error);
  }
}

module.exports = { checkRole }
