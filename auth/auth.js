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
  let reqToken = req.cookies.token || req.headers.authorization;

  if (!reqToken) {
    if (req.accepts('html')) { // Si el cliente acepta HTML redirigir al login
      return res.redirect('/usuarios/login');
    }

    return res.status(401).json({
      code: 401,
      message: "Debe iniciar sesión para acceder a este recurso",
      result: []
    });
  }

  if (reqToken.startsWith('Bearer ')) {
    reqToken = reqToken.replace('Bearer ', '');
  }

  const { valLogin, Utoken } = check(reqToken);

  //Validar token
  if (valLogin !== true) {
    res.clearCookie('token');
    if (req.accepts('html')) {
      return res.redirect('/usuarios/login');
    }
    return res.status(401).json({
      code: 401,
      message: "Token inválido o expirado",
      result: []
    });
  }

  // Verificar Rol
  if (Utoken.rol !== 'user') {
    if (req.accepts('html')) {
      return res.status(403).render('error', {
        code: 403,
        title: 'Acceso Denegado',
        message: 'No tienes permisos de usuario'
      });
    }
    return res.status(403).json({
      code: 403,
      message: 'Acceso denegado: requiere rol de usuario',
      result: []
    });
  }

  req.usuario = Utoken;
  next();
}

function checkLoginAdmin(req, res, next) {
  let reqToken = req.cookies.token || req.headers.authorization;

  if (!reqToken) {
    if (req.accepts('html')) { // Si el cliente acepta HTML redirigir al login
      return res.redirect('/usuarios/login');
    }

    return res.status(401).json({
      code: 401,
      message: "Debe iniciar sesión para acceder a este recurso",
      result: []
    });
  }

  if (reqToken.startsWith('Bearer ')) {
    reqToken = reqToken.replace('Bearer ', '');
  }

  const { valLogin, Utoken } = check(reqToken);

  //Validar token
  if (valLogin !== true) {
    res.clearCookie('token');
    if (req.accepts('html')) {
      return res.redirect('/usuarios/login');
    }
    return res.status(401).json({
      code: 401,
      message: "Token inválido o expirado",
      result: []
    });
  }

  // Verificar Rol
  if (Utoken.rol !== 'admin') {
    if (req.accepts('html')) {
      return res.status(403).render('error', {
        code: 403,
        title: 'Acceso Denegado',
        message: 'No tienes permisos de administrador'
      });
    }
    return res.status(403).json({
      code: 403,
      message: 'Acceso denegado: requiere rol de administrador',
      result: []
    });
  }

  req.usuario = Utoken;
  next();
}

function checkLoginView(req, res, next) {
  let reqToken = req.cookies.token || req.headers.authorization;

  if (!reqToken) {
    return res.redirect('/usuarios/login');
  }

  if (reqToken.startsWith('Bearer ')) {
    reqToken = reqToken.replace('Bearer ', '');
  }

  const { valLogin, Utoken } = check(reqToken);

  if (valLogin !== true) {
    res.clearCookie('token');
    return res.redirect('/usuarios/login');
  }

  req.usuario = Utoken;
  next();
}

module.exports = { checkLogin, checkLoginUser, checkLoginAdmin, checkLoginView };