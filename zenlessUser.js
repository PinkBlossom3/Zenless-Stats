require('dotenv').config();
const axios = require('axios');


const DISCORD_USER_ID = process.env.DISCORD_USER_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID; 
const HOYOLAB_COOKIE = process.env.HOYOLAB_COOKIE;   
const HOYOLAB_UID = process.env.HOYOLAB_UID;


const currentMonth = new Date().toISOString().slice(0, 7).replace('-', ''); 
const HOYOSTAT_URL = `https://sg-act-public-api.hoyolab.com/event/game_record_zzz/api/zzz/index?server=prod_gf_jp&role_id=${process.env.ZENLESS_UID}`;
const HOYOMONTHLY_URL = `https://sg-act-public-api.hoyolab.com/event/nap_ledger/month_info?uid=${process.env.ZENLESS_UID}&region=prod_gf_jp&month=${currentMonth}`;
const HOYOENERGY_URL = `https://sg-act-public-api.hoyolab.com/event/game_record_zzz/api/zzz/note?server=prod_gf_jp&role_id=${process.env.ZENLESS_UID}`;
const HOYOCARD_URL = `https://sg-act-public-api.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid=${process.env.HOYOLAB_UID}`;


async function syncZenlessStats() {
    try {
        const hoyoHeaders = {
            headers: {
                'Cookie': HOYOLAB_COOKIE,
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'x-rpc-client_type': '5', 
                'x-rpc-language': 'en-us',
                'Origin': 'https://act.hoyolab.com',
                'Referer': 'https://act.hoyolab.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        const HOYOSTAT = await axios.get(HOYOSTAT_URL, hoyoHeaders);
        const HOYOMONTH = await axios.get(HOYOMONTHLY_URL, hoyoHeaders);
        const HOYOENERGY = await axios.get(HOYOENERGY_URL, hoyoHeaders);
        const HOYOCARD = await axios.get(HOYOCARD_URL, hoyoHeaders);

        const player = HOYOMONTH.data?.data || HOYOMONTH.data || {};
        const achievement = HOYOSTAT.data?.data || HOYOSTAT.data || {}; 
        const energy = HOYOENERGY.data?.data?.energy || HOYOENERGY.data?.energy || { current: 0 };
        const statsList = HOYOCARD.data?.data?.list?.[0] || HOYOCARD.data?.list?.[0] || {};

        const nickname = statsList.nickname || "Unknown Proxy";
        const ledgerPayload = HOYOMONTH.data?.data || {};
        const ledgerList = ledgerPayload.month_data?.list || [];
        const polychromeItem = ledgerList.find(item => item.data_type === "PolychromesData");
        const polychromeCount = polychromeItem ? polychromeItem.count : 0;

        const payload = {
            username: nickname,
            data: {
                dynamic: [
                    { type: 1, name: "nickname", value: nickname },
                    { type: 1, name: "uid", value: `UID: ${process.env.ZENLESS_UID}` },
                    { type: 1, name: "polychromes", value: polychromeCount},
                    { type: 1, name: "IL_str", value: "Interknot Level" },
                    { type: 2, name: "IL", value: statsList.level || 0 },
                    { type: 1, name: "ach_str", value: "Achievements" },
                    { type: 1, name: "ach", value: achievement.stats?.achievement_count || 0 },
                    { type: 1, name: "SBT_str", value: "Simulated Battle Trial" },
                    { type: 1, name: "SBT", value:  achievement.stats?.climbing_tower_layer || 0 },
                    { type: 1, name: "ENER_str", value: "Energy" },
                    { type: 1, name: "ENER", value: energy.progress.current || 0 },
                    { type: 1, name: "days_str", value: "Days Active" },
                    { type: 1, name: "days", value: achievement.stats?.active_days || 0 },
                    { type: 1, name: "proxylevel", value: "Legendary Proxy" },
                    { type: 1, name: "polychromes_str", value: "Monthly Polychromes" },
                    { type: 1, name: "mini", value: `${nickname}: IL ${statsList.level || 0}` }
                ]
            }
        };

        const discordApiUrl = `https://discord.com/api/v9/applications/${DISCORD_CLIENT_ID}/users/${DISCORD_USER_ID}/identities/0/profile`;

        console.log("⚡ Sending patch request to Discord Profile...");
        const response = await axios.patch(discordApiUrl, payload, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        if (error.response) {
            console.error("\n❌ API Error Response Data:", error.response.status, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("\n❌ Request Error:", error.message);
        }
    }
}

syncZenlessStats();