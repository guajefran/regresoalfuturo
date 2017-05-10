var match = require('../models/match.js');

/**
 * matchController.js
 *
 * @description :: Server-side logic for managing matches.
 */
module.exports = {

    /**
     * matchController.list()
     */
    list: function (req, res) {
        match.find(function (err, matches) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting match.',
                    error: err
                });
            }
            return res.json(matches);
        });
    },

    /**
     * matchController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        match.findOne({_id: id}, function (err, match) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting match.',
                    error: err
                });
            }
            if (!team) {
                return res.status(404).json({
                    message: 'No such match'
                });
            }
            return res.json(match);
        });
    },

    /**
     * matchController.create()
     */
    create: function (req, res) {
        var match = new match({			matchDoor : req.body.matchDoor,			color : req.body.color
        });

        match.save(function (err, match) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating match',
                    error: err
                });
            }
            return res.status(201).json(match);
        });
    },

    /**
     * matchController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        match.findOne({_id: id}, function (err, match) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting match',
                    error: err
                });
            }
            if (!match) {
                return res.status(404).json({
                    message: 'No such match'
                });
            }

            match.matchDoor = req.body.matchDoor ? req.body.matchDoor : match.matchDoor;			match.color = req.body.color ? req.body.color : match.color;
            match.save(function (err, match) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating match.',
                        error: err
                    });
                }

                return res.json(match);
            });
        });
    },

    /**
     * matchController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        match.findByIdAndRemove(id, function (err, match) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the match.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
