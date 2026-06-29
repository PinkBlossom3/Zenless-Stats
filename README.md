# zenless stats!
a discord widget for your zenless stats!

<div align="center">
<img width="352" height="251" alt="main widget" src="https://files.catbox.moe/r3jvqp.png" />
<img width="227" height="80" alt="mini view" src="https://files.catbox.moe/r3j39x.png" />
</div>

special thanks to @chloecinders, @aamia, @bignutty and @.dziurwa and the rest of the smart people at [discord previews](https://discord.gg/discord-603970300668805120) for getting out the first info on these.
# how to use?

### be advised that this requires knowing what you're doing, along with browser devtools knowledge!
> the warning only applies if you are manually creating your widget!
- 1a. use this [widget creation script](https://gist.github.com/aamiaa/7cdd590e3949cd654758bc90bcb4710b) by aamia. skip steps `1b` and `iv` if you are using this.
- 1b. if you want to manually go thru the creation process, follow the steps in this [blog post](https://chloecinders.com/blog/discord-widgets) by chloecinders to create your discord application, social sdk profile and widget design.
- 2. clone this repo and create a .env file with your `ZENLESS_UID`, `HOYOLAB_UID`, `DISCORD_BOT_TOKEN`, `DISCORD_USER_ID`, `DISCORD_CLIENT_ID` and `HOYOLAB_COOKIE`
- 3. run `node enkaUser.js` to sync your zenless stats to discord thru HoYoLab API.
- 4. use a snippet from [discord previews server](https://discord.com/channels/603970300668805120/1509942620762276011) to add it to your profile!
----
if you wish to update your stats, just run the program again and restart your discord to view changes.

may need to add a fallback for Interknot Level manually
