require('dotenv').config();
const axios = require('axios');

const ENKA_URL = `https://enka.network/api/uid/${process.env.GENSHIN_UID}?info`;

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID; 
const DISCORD_USER_ID = process.env.DISCORD_USER_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 

async function syncGenshinStats() {
    try {
        const enkaResponse = await axios.get(ENKA_URL);
        
        const player = enkaResponse.data.playerInfo;
        const region = enkaResponse.data.region; 

        const payload = {
            username: player.nickname,
            data: {
                dynamic: [
                    { type: 1, name: "nickname", value: player.nickname },
                    { type: 1, name: "uid", value: `UID: ${process.env.GENSHIN_UID}` },
                    { type: 1, name: "world", value: `${region} - WL ${player.worldLevel}` },
                    { type: 1, name: "adv_str", value: "Adventure Rank" },
                    { type: 2, name: "adv", value: player.level },
                    { type: 1, name: "ach_str", value: "Achievements" },
                    { type: 2, name: "ach", value: player.finishAchievementNum },
                    { type: 1, name: "aby_str", value: "Spiral Abyss" },
                    { type: 1, name: "aby", value: `${player.towerFloorIndex} - ${player.towerLevelIndex} (${player.towerStarIndex}★)` },
                    { type: 1, name: "img_str", value: "Imaginarium Theatre" },
                    { type: 1, name: "img", value: `Act ${player.theaterActIndex}${player.theaterModeIndex === 104 ? '-2' : ''} (${player.theaterStarIndex}★)` },
                    { type: 1, name: "sty_str", value: "Stygian Onslaught" },
                    { type: 1, name: "sty", value: `Diff ${player.stygianIndex} - ${player.stygianSeconds}s` },
                    { type: 1, name: "sig", value: `"${player.signature}"` },
                    { type: 1, name: "world_str", value: "World Level" },
                    { type: 1, name: "mini", value: `${player.nickname}: AR ${player.level}` }
                ]
            }
        };

        const discordApiUrl = `https://discord.com/api/v9/applications/${DISCORD_CLIENT_ID}/users/${DISCORD_USER_ID}/identities/0/profile`;

        const response = await axios.patch(discordApiUrl, payload, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Successfully synced Genshin widget for ${player.nickname}. Status: ${response.status}`);

    } catch (error) {
        if (error.response) {
            console.error("Discord API Error:", error.response.status, error.response.data);
        } else {
            console.error("Request Error:", error.message);
        }
    }
}

syncGenshinStats();