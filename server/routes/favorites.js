const express = require('express');
const router = express.Router();
const listFavorites = require('app/favorites/listfavorites.get');
const addFavorite = require('app/favorites/addFavorite.post');
const deleteFavorite = require('app/favorites/favorite.delete');

router.get('/', listFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);

module.exports = router;
