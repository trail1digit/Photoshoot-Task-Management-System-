const Module = require("../models/Module");
const SubModule = require("../models/SubModule");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const mongoose = require("mongoose");

async function getModuleData() {
    const modulesData = await Module.find();
    return modulesData;
}

async function addModule(data) {
    let {
        module_name,
        icon,
        path,
        key,
        position
    } = data;

    const newModule = new Module({
        module_name,
        icon,
        path,
        key,
        position
    });

    await newModule.save();

}

async function addSubModule(data) {
    let {
        module_id,
        submodule_name,
        icon,
        path,
        key,
        position
    } = data;

    const newSubModule = new SubModule({
        module_id,
        submodule_name,
        icon,
        path,
        key,
        position
    });

    await newSubModule.save();

}

async function addRole(data) {
    try {
        const { role_name, is_admin, permission } = data;

        // 1️⃣ Create the role
        const newRole = new Role({ role_name, is_admin });
        const savedRole = await newRole.save();

        // 2️⃣ Create permissions for that role
        if (permission && Array.isArray(permission)) {
            const permissionDocs = permission.map(p => ({
                role_id: savedRole._id, // assign the new role’s ID
                module_id: p.module_id,
                submodule_id: mongoose.Types.ObjectId.isValid(p.submodule_id) ? p.submodule_id : undefined,
                create: p.create,
                edit: p.edit,
                list: p.list,
                delete: p.delete,
            }));

            await Permission.insertMany(permissionDocs);
        }
    } catch (error) {
        console.error("Error adding role with permissions:", error);
        throw error;
    }

}

module.exports = {
    getModuleData,
    addModule,
    addSubModule,
    addRole,
}