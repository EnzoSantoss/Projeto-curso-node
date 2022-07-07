module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid;

  //Verificando se o usuario esta logado no sistema:

  //Caso não estiver será redirecionado para login
  if (!userId) {
    res.redirect("/login");
  }

  //Caso estiver logado, porá seguir normalmente
  next();
};
