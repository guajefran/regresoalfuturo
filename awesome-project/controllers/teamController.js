var Team = require('../models/Team.js');

/**
 * teamController.js
 *
 * @description :: Server-side logic for managing teams.
 */
module.exports = {

    /**
     * teamController.list()
     */
    list: function (req, res) {
        Team.find(function (err, teams) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting team.',
                    error: err
                });
            }
            return res.json(teams);
        });
    },

    /**
     * teamController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        Team.findOne({_id: id}, function (err, team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting team.',
                    error: err
                });
            }
            if (!team) {
                return res.status(404).json({
                    message: 'No such team'
                });
            }
            return res.json(team);
        });
    },

    /**
     * teamController.create()
     */
    create: function (req, res) {
        var team = new team({        });

        Team.save(function (err, team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating team',
                    error: err
                });
            }
            return res.status(201).json(team);
        });
    },

    /**
     * teamController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        Team.findOne({_id: id}, function (err, team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting team',
                    error: err
                });
            }
            if (!team) {
                return res.status(404).json({
                    message: 'No such team'
                });
            }
            Team.save(function (err, team) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating team.',
                        error: err
                    });
                }

                return res.json(team);
            });
        });
    },

    /**
     * teamController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        team.findByIdAndRemove(id, function (err, team) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the team.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
