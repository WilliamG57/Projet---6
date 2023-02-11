const Sauce = require('../models/sauce'); //Récupération du model sauce
const fs = require ("fs"); // Module 'file system' pour gérer les téléchargements et modif d'images



// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // Sauvegarde de la sauce dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregitsrée !"}))
        .catch((error) => res.status(400).json({ error }));
}

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then ((sauce) => {
            console.log(sauce.userId)
            console.log(req.auth.userId)
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    error: new Error("User non autorisé"),
                });
            }
        })
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce
    .updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(()=> res.status(400).json({ error}))
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
    Sauce.deleteOne({_id: req.params.id})
        .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))
        .catch(error => res.status(400).json({ error}))
    });
})
};

// On récupère toutes les sauces
exports.getAllSauces = (req, res, next) => { 
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};

// On récupère une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};

// Like, unlike and dislike
// On identifie si il s'agit d'un like ou d'un dislike, on push l'user et on incrémente de 1
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    if(like === 1) {
        Sauce.updateOne({_id: req.params.id}, { $inc: {likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id})
        .then(() => res.status(200).json({ message: "Vous aimez cette sauce" }))
        .catch( error => res.status(400).json({ error}))

    }  else if(like === -1) {
        Sauce.updateOne({_id: req.params.id}, { $inc: {dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id})
        .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce" }))
        .catch( error => res.status(400).json({ error}))

    } else {  // Annuler un like ou un dislike, on incrémente de -1
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch( error => res.status(400).json({ error}))
                }
        })
    }
}