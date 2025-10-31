const roleService = require("../services/roleService");

const getModuleData = (req, res, next) => {
    roleService.getModuleData()
        .then((response) => {
            res.send({
                message: "Data getting Successfully",
                data: response
            })
        }).catch((err) => {
            console.log(err);
        });
}

const addModule = (req, res, next) => {
    roleService.addModule(req.body)
        .then((response) => {
            res.send({
                message: "Data Added Successfully"
            })
        }).catch((err) => {
            console.log(err);
        });
}

const addSubModule = (req, res, next) => {
    roleService.addSubModule(req.body)
        .then((response) => {
            res.send({
                message: "Data Added Successfully"
            })
        }).catch((err) => {
            console.log(err);
        });
}

const addRole = (req, res, next) => {
    roleService.addRole(req.body)
        .then((response) => {
            res.send({
                message: "Data Added Successfully"
            })
        }).catch((err) => {
            throw new Error(err);
        });
}

module.exports = {
    getModuleData,
    addModule,
    addSubModule,
    addRole
}