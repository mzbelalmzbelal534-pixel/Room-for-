const schedule = require('node-schedule');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');

module.exports.config = {
  name: 'autosent',
  version: '25.0.0',
  hasPermssion: 0,
  credits: 'Belal x Gemini',
  description: 'THE ROYAL DIAMOND LIFESTYLE HUB',
  commandCategory: 'system',
  usages: '[]',
  cooldowns: 3
};

module.exports.onLoad = ({ api }) => {
  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Dhaka';
  rule.minute = 0; 

  schedule.scheduleJob(rule, async () => {
    try {
      const now = moment().tz('Asia/Dhaka');
      const time = now.format('hh:mm A');
      const date = now.format('DD / MM / YYYY');
      const day = now.format('dddd');
      const hour = now.hour();

      async function getPrayerTimes(city) {
        try {
          const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=2`);
          const t = res.data.data.timings;
          const fmt = (tm) => moment(tm, "HH:mm").format("hh:mm A");
          return { f: fmt(t.Fajr), d: fmt(t.Dhuhr), a: fmt(t.Asr), m: fmt(t.Maghrib), i: fmt(t.Isha), s: fmt(t.Sunrise) };
        } catch (e) { return null; }
      }

      const p = await getPrayerTimes("Kurigram");
      const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

      // ডাইনামিক গ্রিটিংস
      let greet = "শুভ রাত্রি 🌌";
      if (hour >= 5 && hour < 12) greet = "শুভ সকাল 🌅";
      else if (hour >= 12 && hour < 17) greet = "শুভ দুপুর ☀️";
      else if (hour >= 17 && hour < 20) greet = "শুভ সন্ধ্যা 🌇";

      // 💎 নতুন লাক্সারি ডিজাইন এলিমেন্টস
      const top = "╔═════════════════════════╗";
      const mid = "╠═════════════════════════╣";
      const bot = "╚═════════════════════════╝";
      const sep = "╟─────────────────────────╢";

      const msg = `
${top}
   💎 𝗠𝗔𝗦𝗧𝗘𝗥 𝗕𝗘𝗟𝗔𝗟 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 💎
${mid}
  📅 𝗗𝗔𝗧𝗘 : ${date}
  🕒 𝗧𝗜𝗠𝗘 : ${time}  |  💠 ${day}
${sep}
  🕋 𝗣𝗥𝗔𝗬𝗘𝗥 𝗧𝗜𝗠𝗘𝗦 (𝗞𝗨𝗥𝗜𝗚𝗥𝗔𝗠)
  
  💠 ফজর   : ${p ? p.f : '--'}
  💠 জোহর : ${p ? p.d : '--'}
  💠 আসর   : ${p ? p.a : '--'}
  💠 মাগরিব : ${p ? p.m : '--'}
  💠 এশা    : ${p ? p.i : '--'}
  🌅 সূর্যোদয় : ${p ? p.s : '--'}
${sep}
  ✨ 𝗦𝗧𝗔𝗧𝗨𝗦 : ${greet}
  📿 𝗔𝗠𝗔𝗟   : নামাজের প্রতি যত্নবান হোন।
${sep}
  🚀 𝗦𝗬𝗦𝗧𝗘𝗠 : ${ram} MB | ✅ Active
  💡 𝗧𝗜𝗣     : বিনয় আভিজাত্যের প্রতীক।
${mid}
      ✡️⃝🅰🅳🅼🅸🇳─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️
${bot}`;

      const allThreads = global.data.allThreadID || [];
      for (const tID of allThreads) {
        api.sendMessage(msg, tID);
        await new Promise(r => setTimeout(r, 2000)); 
      }
    } catch (err) { console.error(err); }
  });
};

module.exports.run = () => {};
