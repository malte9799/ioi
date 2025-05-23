# TrappedMC QOL Mod - IoI

## Installation

To use this module, you need to install the ChatTriggers mod for Minecraft 1.21.4 and download the latest release of this module.

### Step 1: Install ChatTriggers Mod for Fabric 1.21.4

> [!WARNING]
>
> There is no official ChatTriggers release for Minecraft 1.21.4, as the [original project](https://github.com/ChatTriggers/ctjs) is currently being rewritten for 1.19. You'll need to use a community port for 1.21.4 compatibility.

1. Download the unofficial ChatTriggers port for Minecraft 1.21.4 from [github:malte9799/ctjs](https://github.com/malte9799/ctjs/releases).
2. Place the downloaded `.jar` file into your Minecraft `mods` folder.
3. Launch Minecraft and join a Singeplayer World or a Server.
4. Run `/ct files` to ensure the mod is installed correctly. A explorer Window will open where you need to place the IoI Module from Step 2.

### Step 2: Download IoI Module

1. Go to the [IoI releases page](https://github.com/malte9799/ioi/releases).
2. Download the latest release `.zip` file.
3. Extract (Unzip) the contents of the `.zip` file into the just opened folder (`/config/ChatTriggers/modules/ioi/`)
4. Run `/ct load` or Restart Minecraft to load the module.

---

## Features

#### All features can be toggled in `/ioi settings` or manually with `/ioi features [enable|disable] <name>`

[1]: https://minecraft.wiki/images/Invicon_Diamond_Pickaxe.png
[2]: https://minecraft.wiki/images/Invicon_Diamond_Hoe.png
[3]: https://minecraft.wiki/images/Invicon_Fishing_Rod.png
[4]: https://minecraft.wiki/images/Invicon_Compass.gif

|     | name                        | description                                                                                     | enabled by default |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------- | :----------------: |
|     | <sub>![1]</sub> **Mining**  |                                                                                                 |                    |
| ✅  | Chamber Notification        | Displays a title text when you find a chamber                                                   |         ✓          |
| ✅  | SuperBreaker                | Displays the Super Breaker cooldown on all pickaxes and remindes you when ready                 |         ✓          |
| ✅  | SpeedBreaker                | Plays a sound when you get the Haste effect from SpeedBreaker (only lvl 1-2)                    |         ✓          |
|     | <sub>![2]</sub> **Fishing** |                                                                                                 |                    |
| 🔜  | OverFishing                 | Highlights the area you're about to overfish                                                    |         ✗          |
|     | <sub>![3]</sub> **Farming** |                                                                                                 |                    |
| ✅  | GreenTerra                  | Displays the cooldown for the Green Terra ability on hoes.                                      |         ✓          |
| 🚧  | FarmCheck                   | Analyzes any farm and displays stats like missing crops or fully grown percentage `/checkFarm`  |         ✓          |
| ✅  | Yaw & pitch Display         | Displays your yaw and pitch                                                                     |         ✗          |
|     | <sub>![4]</sub> **Misc**    |                                                                                                 |                    |
| ✅  | QuestDisplay                | Displays active quests and thair perogress in a customizable Scoreboard                         |         ✓          |
| ✅  | Auction                     | Displays price per unit after the total price for stacked items                                 |         ✓          |
| ✅  | CrateCooldown               | Displays a 30-second cooldown on all crates when you find one (Put one in your Hotbar for this) |         ✓          |
| ✅  | CrateTracker                | Tracks crate rewards and displays statistics in the crate GUI when pressing Shift               |         ✓          |
| ✅  | EasyClaim                   | Highlights claimable items in `/rewards`                                                        |         ✓          |
| ✅  | Emblems                     | Tracks active emblem boosters and displays their remaining time using BossBars                  |         ✓          |
| ✅  | HotKey                      | Allows you to bind custom commands or messages to hotkeys. `/hetkey help`                       |         ✓          |
| ✅  | ChatTabs                    | prefills the chat input box with `/gc ` or `/msg {player} ` when in gang or private chat        |         ✓          |
| 🚧  | ProgressBar                 | Enhances the progress bar                                                                       |         ✓          |
| 🔜  | PlayerHider                 | Hides players near specific NPCs or locations                                                   |         ✗          |
| 🔜  | Vaults                      | Displays a preview of a vault's contents when hovering over it in the Vault Menu                |         ✗          |
| 🔜  | Parkour                     | Tracks parkour competitions and displays leaderboards                                           |         ✗          |
| 🔜  | PetsOverlay                 | Adds a pet info HUD that displays all equipped pets with their level and a progress bar         |         ✗          |

<sub>✅: Finished | 🚧: Work in progress | 🔜: Comming Soon</sub>
