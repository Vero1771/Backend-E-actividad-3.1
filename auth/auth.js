const envResult = require('dotenv').config()
let jwt = require('jsonwebtoken');

//Error al leer variable JWT_SECRET en .env
if (!envResult.parsed.JWT_SECRET) {
  let error_dotenv_JWT = 'No se ha encontrado la variable de entorno: "JWT_SECRET". \n';
  throw error_dotenv_JWT 
}

function check(token) {
  token = token.replace('Bearer ', '');
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valLogin: true, Utoken: decoded };
  } catch (err) {
    return { valLogin: err };
  }
}

function checkLogin(req, res, next) {
  let reqToken = req.headers.authorization;
  if (reqToken == undefined) {
    return res.status(401).json({
      code: 401,
      message: `Debe ingresar un Token`,
      result: []
    });
  }
  const { valLogin } = check(reqToken);
  if (valLogin !== true) {
    return res.status(401).json({
      code: 401,
      message: 'Token inválido:  \n' + valLogin,
      result: []
    });
  }
  next();
}

function checkLoginUser(req, res, next) {
  let reqToken = req.headers.authorization;
  if (reqToken == undefined) {
    return res.status(401).json({
      code: 401,
      message: `Debe ingresar un Token`,
      result: []
    });
  }

  const { valLogin, Utoken } = check(reqToken);
  if (valLogin !== true) {
    return res.status(401).json({
      code: 401,
      message: 'Token inválido:  \n' + valLogin,
      result: []
    });
  }

  if (Utoken.rol !== 'user') {
    return res.status(403).json({
      code: 403,
      message: 'Acceso denegado: No tienes los permisos necesarios',
      result: [Utoken]
    });
  };

  req.usuario = Utoken;

  next();
}

function checkLoginAdmin(req, res, next) {
  let reqToken = req.headers.authorization;
  if (reqToken == undefined) {
    return res.status(401).json({
      code: 401,
      message: `Debe ingresar un Token`,
      result: []
    });
  }

  const { valLogin, Utoken } = check(reqToken);
  if (valLogin !== true) {
    return res.status(401).json({
      code: 401,
      message: 'Token inválido:  \n' + valLogin,
      result: []
    });
  }

  if (Utoken.rol !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: 'Usted no posee permisos de administrador',
      result: [Utoken]
    });
  };

  req.usuario = Utoken;

  next();
}

module.exports = { checkLogin, checkLoginUser, checkLoginAdmin };