const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async (req, res) => {
        try {
            const allGenres = await db.Genre.findAll();
            return res.render("moviesAdd", {
                allGenres
            });
        } catch (error) {
            console.log(error);
        }
    },
    create: (req, res) => {
        db.Movie.create({
            ...req.body,
        })
        .then(() =>{
            res.redirect('/movies')
        })
        .catch(errors => console.log(errors));
    },

    edit: async (req, res) => {
        try {  
        const allGenres = await db.Genre.findAll();
        let movie = db.Movie.findByPk(req.params.id)
        .then(movie => {
            return res.render ('moviesEdit', {movie, allGenres})
        })}
        catch (error) {
            console.log(error);
        }
    } ,
    update: (req,res) => {
        db.Movie.findByPk(req.params.id)
        db.Movie.update({
            ...req.body,
        },{
            where : {id : req.params.id}
        })
        .then(() =>{
            res.redirect('/movies')
        })
        .catch(errors => console.log(errors));
    },
 
    remove: (req, res) => {
        let movie = db.Movie.findByPk(req.params.id)
        .then(movie => {
            return res.render ('moviesDelete', {movie})
        })
        .catch(error => console.log(error))
    },
    destroy: (req, res) =>{
        db.Movie.findByPk(req.params.id)
        db.Movie.destroy({
            where : {id : req.params.id}
        })
        .then(() =>{
            res.redirect('/movies')
        })
        .catch(errors => console.log(errors)); 
    }  
}

module.exports = moviesController;