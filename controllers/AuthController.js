const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

module.exports = class Authcontroller {
  static login(req, res) {
    res.render("auth/login");
  }

  static regiter(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //password match validation
    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem, por favor tente novamente");
      res.render("auth/register");
      return;
    }

    //check if user exists
    const checkUserEmail = await User.findOne({
      raw: true,
      where: { email: email },
    });

    console.log(checkUserEmail);

    if (checkUserEmail) {
      req.flash(
        "message",
        "Opss ... Parece que esse email ja foi cadastrado em nosso sistema! Por favor tente novamente"
      );
      res.render("auth/register");
      return;
    }

    //create a password -----PONTO DE REVISÃO----
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);
      //initialize session
      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log(
        `Não foi possivel registrar o usuario no banco de dados: ${err}`
      );
      return;
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    //find user

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuario não cadastrado no sistema");
      res.render("auth/login");

      return;
    }

    //check password

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha invalida");
      res.render("auth/login");

      return;
    }

    //initialize session
    req.session.userid = user.id;

    req.flash("message", "Autenticação realizada com sucesso");
    req.session.save(() => {
      res.redirect("/");
    });
  }
};
