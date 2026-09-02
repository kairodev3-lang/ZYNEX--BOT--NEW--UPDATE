const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const { fakevCard } = require('../lib/fakevCard');

// Konvèti tèks nòmal an style "Mathematical Sans-Serif Bold" (𝙳𝚁𝚄𝚉𝚉 style)
function styleText(text) {
    return text.toUpperCase().split('').map(ch => {
        if (ch >= 'A' && ch <= 'Z') {
            return String.fromCodePoint(0x1D5D4 + (ch.charCodeAt(0) - 65));
        }
        if (ch >= '0' && ch <= '9') {
            return String.fromCodePoint(0x1D7EC + (ch.charCodeAt(0) - 48));
        }
        return ch;
    }).join('');
}

// Emoji pou chak kategori — ajoute lòt si w gen lòt non kategori
const categoryEmojis = {
    system: '🏠',
    tools: '⚡',
    settings: '⚙️',
    config: '⚙️',
    group: '👥',
    media: '🎬',
    sticker: '🎬',
    search: '🔎',
    download: '📥',
    downloader: '📥',
    new: '🆕',
    tags: '🏷️',
    owner: '👑',
    admin: '🛡️',
    fun: '🎉',
    adult: '🔞',
    general: '📋',
    main: '📋',
};

// Emoji ki matche non kòmand la egzakteman (rekonesans dirèk)
const commandEmojis = {
    menu: '📜', help: '❓', ping: '🏓', alive: '💚', online: '🟢', uptime: '⏱️',
    owner: '👑', setprefix: '🔠', mode: '🔧', autotyping: '⌨️', autorecording: '🎙️',
    autoread: '👁️', autolikestatus: '❤️', autoviewsview: '👀', anticall: '📵',
    'anti-call': '📵', welcome: '👋', goodbye: '👋', autobio: '📝', antidelete: '🗑️',
    leave: '🚪', unblock: '🔓', vv: '🔓', kick: '👢', kickall: '👢', promote: '⬆️',
    demote: '⬇️', removeadmins: '⬇️', botadmin: '🛡️', add: '➕', addmember: '➕',
    hidetag: '🔖', admincheck: '🛡️', groupstatus: '📊', tagall: '📢', end: '⛔',
    requestlist: '📋', acceptall: '✅', rejectall: '❌',
    apk: '📱', fb: '📘', pair: '🔗', pair2: '🔗', igdl: '📸', igdl2: '📸', igdl4: '📸',
    ig3: '📸', song: '🎵', video: '🎥', video1: '🎥', yts: '🔎', screenshot: '🖥️',
    attp: '🖼️', xxxvideo: '🔞', leakvideo: '🔞', leakvideo2: '🔞', boobs: '🔞', xgirl: '🔞',
};

// Detekte emoji pa mo kle si non kòmand la pa nan lis egzak la
function getCommandEmoji(name) {
    const n = name.toLowerCase();
    if (commandEmojis[n]) return commandEmojis[n];
    if (n.includes('kick')) return '👢';
    if (n.includes('mute')) return '🔇';
    if (n.includes('promote') || n.includes('admin')) return '⬆️';
    if (n.includes('demote')) return '⬇️';
    if (n.includes('video')) return '🎥';
    if (n.includes('song') || n.includes('audio') || n.includes('music')) return '🎵';
    if (n.includes('sticker') || n.includes('img') || n.includes('photo') || n.includes('pp')) return '🖼️';
    if (n.includes('link')) return '🔗';
    if (n.includes('tag')) return '📢';
    if (n.includes('pair')) return '🔗';
    if (n.includes('block')) return '🔓';
    if (n.includes('bug')) return '💣';
    if (n.includes('menu')) return '📜';
    return '▫️';
}

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply, pushname }) => {
    try {
        let totalCommands = 0;
        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;

            totalCommands++;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        const day = moment().tz("Africa/Kampala").format("dddd");
        const date = moment().tz("Africa/Kampala").format("DD/MM/YYYY");
        const prefix = require('../config').PREFIX;
        const userName = pushname || 'BOT';

        // Bloc header — chak liy anba yon sèl *...* pou li parèt an gwo
        let caption = `*╭──────── 🗽 ${styleText('KAIRO ZYNEX')} ────────╮*\n`;
        caption += `*│*\n`;
        caption += `*│  ◈ ${styleText('PREFIX')}   : ${prefix}*\n`;
        caption += `*│  ◈ ${styleText('WASSUP')}   : ${userName}*\n`;
        caption += `*│  ◈ ${styleText('DAY')}      : ${styleText(day)}*\n`;
        caption += `*│  ◈ ${styleText('DATE')}     : ${date}*\n`;
        caption += `*│  ◈ ${styleText('VERSION')}  : 1.0.0*\n`;
        caption += `*│  ◈ ${styleText('PLUGINS')}  : ${totalCommands}*\n`;
        caption += `*│  ◈ ${styleText('TYPE')}     : ${styleText('KAIRO ZYNEX-MD')}*\n`;
        caption += `*│*\n`;
        caption += `*╰────────────────────────────────────╯*\n\n`;

        // Bloc menu — chak kategori jenere otomatikman, chak kòmand ak pwòp emoji pa l
        for (const cat in grouped) {
            const catEmoji = categoryEmojis[cat.toLowerCase()] || '🔹';
            caption += `*╔═══「 ${catEmoji} ${styleText(cat)} 」═══╗*\n`;
            caption += `*║*\n`;
            for (const c of grouped[cat]) {
                const cmdEmoji = getCommandEmoji(c);
                caption += `*║  ${cmdEmoji} ${prefix}${styleText(c)}*\n`;
            }
            caption += `*║*\n`;
            caption += `*╚═══════════════════╝*\n\n`;
        }

        caption += `*⟪ ⚡ ${styleText('POWERED BY KAIRO ZYNEX')} ⚡ ⟫*`;

        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/prkkzj.png" },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363409975095814@newsletter",
                    newsletterName: "𝗞𝗔𝗜𝗥𝗢-𝗭𝗬𝗡𝗘𝗫",
                    serverMessageId: 2,
                },
            },
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ Error while generating menu.");
    }
});
