var team = require('../models/team.js');

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
        team.find(function (err, teams) {
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
        team.findOne({_id: id}, function (err, team) {
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
        var team = new team({			teamDoor : req.body.teamDoor,			color : req.body.color
        });

        team.save(function (err, team) {
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
        team.findOne({_id: id}, function (err, team) {
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

            team.teamDoor = req.body.teamDoor ? req.body.teamDoor : team.teamDoor;			team.color = req.body.color ? req.body.color : team.color;
            team.save(function (err, team) {
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
