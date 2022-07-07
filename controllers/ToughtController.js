const Tought = require("../models/Tought.js");
const User = require("../models/User.js");

const { Op } = require("Sequelize");

module.exports = class Toughts {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    //Filtrando por ordem
    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    //Revisar essa parte//

    const toughtsData = await Tought.findAll({
      include: User,
      //Fazendo busca no banco de dados dos items digitados pelo usuario
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });
    const toughts = toughtsData.map((result) => {
      return result.get({ plain: true });
    });

    res.render("toughts/home", { toughts, search });
  }

  static async dashborad(req, res) {
    const userId = req.session.userid;

    //Achando o usuario no banco de dados e juntando com a tabela de pensamentos relacionados
    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });

    //Checando se usuario existe
    if (!user) {
      res.redirect("/login");
    }

    //Retornando apenas os dados relevantes
    const toughts = user.Toughts.map((result) => {
      return result.dataValues;
    });

    //Verificando se existe pensamentos cadastrados nos sistema
    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Pensamento criado");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;

    try {
      await Tought.destroy({ where: { id: id } });

      req.flash("message", "Pensamento excluido com sucesso");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ raw: true, where: { id: id } });

    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;
    const tought = { title: req.body.title };

    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash("message", "Pensamento atualizado com sucesso");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }
};
