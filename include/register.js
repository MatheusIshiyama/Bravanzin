const guildModel = require("../models/guild");
const userModel = require("../models/user");

module.exports = {
    async guildRegister(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if (!req) {
            const guildInfo = new guildModel({
                serverId: guild.id,
                serverName: guild.name,
                prefix: ";",
                playlists: null,
                memberCountId: null,
            });
            await guildInfo.save();
            console.log(`O bot entrou no servidor "${guild.name}"`);
        }
    },

    async guildRemove(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if (req) {
            req.deleteOne({ serverId: `${guild.id}` });
            console.log(`O bot saiu do servidor "${guild.name}"`);
        }
    },

    async guildUpdate(guild) {
        const req = await guildModel.findOne({ serverId: guild.id });
        if (req) {
            if (req.serverName != guild.name) {
                console.log(
                    `Servidor "${req.serverName}" atualizou o nome para "${guild.name}"`
                );
                await guildModel.findOneAndUpdate(
                    { serverId: guild.id },
                    { serverName: guild.name }
                );
            }
        }
    },

    async user(user) {
        const req = await userModel.findOne({ id: user.id });
        if (!req) {
            const userInfo = new userModel({
                id: user.id,
                name: user.username,
                locale: "en-us",
                playlist: {
                    title: null,
                    url: null,
                    thumbnail: null,
                },
                favSong: {
                    title: null,
                    url: null,
                    thumbnail: null,
                },
                toDo: null,
            });
            await userInfo.save();
            console.log(`${user.username} se registrou`);
        } else {
            if (req.name != user.username) {
                console.log(
                    `Usuário: ${req.name} atualizou o nome para ${user.username}`
                );
                await userModel.findOneAndUpdate(
                    { id: user.id },
                    { name: user.username }
                );
            }
        }
    },
};
