/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import PogObject from 'PogData';
import db from '../db';
import huds from '../huds';

const Background = com.chattriggers.ctjs.api.render.Display.Background;
const fishRarity = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique', 'ethereal', 'mythic', 'boss'];

const textHud = huds.createTextHud('test2', 120, 10, '&aThis is\n&cA &4Test\n&bThis might be a bigger text\n&2Not this one though');

textHud.onDraw((x, y, str) => {
	Renderer.pushMatrix();
	Renderer.translate(x, y);
	Renderer.scale(textHud.getScale());
	Renderer.drawStringWithShadow(str, 0, 0);
	Renderer.popMatrix();
});

class QuestDisplay extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		// this.DB = new PogObject('ioi', { active: {} }, 'data/quests.data.json');
		// this.DB.autosave();
		if (!db.quests) db.quests = [];

		this.questTracker = {};

		// this.display = new Display({ x: 4, y: Renderer.screen.getHeight() / 2, background: Background.FULL }).addLine('§6§l    Active Quests    ');
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('renderOverlay', () => {
			if (huds.isOpen()) return;

			Renderer.pushMatrix().translate(textHud.getX(), textHud.getY()).scale(textHud.getScale());
			Renderer.drawRect(Renderer.getColor(0, 0, 0, 80), -2, -2, textHud.getWidth() + 4, textHud.getHeight() + 4);
			Renderer.drawStringWithShadow(textHud.text, 0, 0);
			Renderer.popMatrix();
		});
		this.registerStep(false, 1, () => {
			// textHud.text =
			// Object.entries(this.DB.active)
			// 	.map(([questName, quest]) => {
			// 		const percent = Math.round((quest.progress / quest.goal) * 10000) / 100;
			// 		return [percent, `§6§l| §r${questName}: \n§6§l|   §a${quest.progress}§7/§c${quest.goal} §7[${percent}%]`];
			// 	})
			// 	.sort((a, b) => b[0] - a[0])
			// 	.forEach(([, line], i) => {
			// 		this.display.setLine(i + 1, line);
			// 	});
		});

		// this.loadQuestTriggers();

		// this.registerEvent('renderOverlay', () => {
		// 	Object.entries(this.DB.active)
		// 		.map(([questName, quest]) => {
		// 			const percent = Math.round((quest.progress / quest.goal) * 10000) / 100;
		// 			return [percent, `§6§l| §r${questName}: \n§6§l|   §a${quest.progress}§7/§c${quest.goal} §7[${percent}%]`];
		// 		})
		// 		.sort((a, b) => b[0] - a[0])
		// 		.forEach(([, line], i) => {
		// 			this.display.setLine(i + 1, line);
		// 		});

		// 	this.display.setY((Renderer.screen.getHeight() - this.display.getHeight()) / 2).draw();
		// });

		this.registerEvent('guiOpened', (gui, event) => {
			if (gui.getTitle().getString() !== 'Active Quests') return;
			// this.DB.active = {};
			let quests = [];
			Client.scheduleTask(1, () => {
				const items = Player.getContainer().getItems().slice(28, 44);
				items.forEach((item, i) => {
					const name = ChatLib.removeFormatting(item?.getName() || '').trim();
					if (!item || !name || !item.getLore()) return;
					const lore = item
						.getLore()
						.reduce((acc, cur) => {
							if (cur.unformattedText) acc.push(cur.unformattedText);
							return acc;
						}, [])
						.join(' ');
					let [progress, goal] = lore.match(/Progress:  - (\d+\/\d+)/)[1].split('/');
					const objectives = lore
						.match(/Objectives: (.+)/)[1]
						.split(' - ')
						.slice(1);

					quests.push({
						name,
						goal: parseInt(goal),
						progress: parseInt(progress),
						item: item.getType().getRegistryName(),
						objectives,
					});
					// this.DB.active[name] = {
					// 	goal: parseInt(goal),
					// 	progress: parseInt(progress),
					// 	objectives,
					// 	item: item.getType().getRegistryName(),
					// };
				});
				// console.dir(quests);
				console.log(JSON.stringify(quests, undefined, 2));
				// this.loadQuestTriggers();
			});
		});

		this.registerChat('| QUESTS | You completed ${questName}!', (questName) => {
			this.questTracker[questName].unregister();
			delete this.questTracker[questName];
			// delete this.DB.active[questName];
			this.display.clearLines();
		});

		this.registerChat('| RANKUP | You have ranked up to ${rank}', () => {
			Object.values(this.questTracker).forEach((e) => e.unregister());
			this.questTracker = {};
			// this.DB.active = {};
			this.display.clearLines();
		});
	}
	onDisable() {
		// this.DB.save();
	}

	loadQuestTriggers() {
		// #CHAT
		// ✓ Catch ${num} Fish
		// ✓ Cach ${num} ${rarity}+ Fish
		// ✓ Find ${num} Mine Crates
		// ✓ Use the Superbreaker Mining Ability ${num} times
		// ✓ Vote for the Server ${num} times
		// ✓ Earn ${lvl} McMMO Levels
		// ✓ Loot ${num} Chambers
		// Find ${num} Fishing Crates
		// Participate in ${num} Vote Parties

		// # break Block
		// ✓ Mine ${num} ${block}
		// ✓ Collect ${num} Logs
		// ✓ Dig ${num} ${block}
		// ✓ Harvest ${num} Crops

		// # Unknown
		// Rent a cell for at least ${num} hours
		// Apply a ${rarity|Custom} Enchant
		// Smelt ${num} ${item}
		Object.values(this.questTracker).forEach((e) => e.unregister());
		this.questTracker = {};

		Object.entries(this.DB.active).forEach(([questName, quest]) => {
			if (quest.progress >= quest.goal) {
				delete this.DB.active[questName];
				return;
			}
			quest.objectives.forEach((o, i) => {
				if (/Collect [\d,]* Logs/.test(o)) {
					const event = this.registerEvent('blockBreak', (block) => {
						if (!/minecraft:\w*_log/.test(block.type.getRegistryName())) return;
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/(?:Mine|Dig) [\d,]* [\w ]*/.test(o)) {
					const filterBlock = o
						.match(/(?:Mine|Dig) [\d,]* ([\w ]*)/)[1]
						.replaceAll(' ', '_')
						.toLowerCase()
						.replace('coal', 'coal_ore');
					const event = this.registerEvent('blockBreak', (block) => {
						if (filterBlock !== 'blocks' && !new RegExp(`minecraft:${filterBlock}`).test(block)) return;
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Harvest [\d,]* Crops/.test(o)) {
					const event = this.registerEvent('blockBreak', (block) => {
						if (!/minecraft:(?:wheat|beetroots|carrots|potatoes)/.test(block.type.getRegistryName())) return;
						const fullyGrown = block
							.getState()
							.getEntries()
							.entrySet()
							.stream()
							.anyMatch((e) => e.getKey().getValues().getLast() == e.getValue());
						if (!fullyGrown) return;

						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}

				if (/Catch [\d,]* Fish/.test(o)) {
					this.registerChat('| FISH | You caught a ${size}cm Fish', () => {
						this.DB.active[questName].progress++;
					});
				}
				if (/Catch [\d,]* \w*\+ Fish/.test(o)) {
					const event = this.registerChat('| FISH | You caught a ${size}cm ${rarity} Fish!', (size, rarity) => {
						const rarity = o.match(/Catch [\d,]* (\w*)\+ Fish/)[1].toLowerCase();
						const rarityList = fishRarity.slice(fishRarity.indexOf(rarity));

						if (rarityList.includes(rarity.toLowerCase())) this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Find [\d,]* Mine Crates/.test(o)) {
					const event = this.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
						const tool = Player.getHeldItem()?.getType()?.getRegistryName();
						if (!tool) if (!Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_pickaxe')) return;
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Find [\d,]* Fishing Crates/.test(o)) {
					const event = this.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
						const tool = Player.getHeldItem()?.getType()?.getRegistryName();
						if (!tool) if (!Player.getHeldItem()?.getType()?.getRegistryName() == 'minecraft:fishing_rod') return;
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Find [\d,]* Farming Crates/.test(o)) {
					const event = this.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
						const tool = Player.getHeldItem()?.getType()?.getRegistryName();
						if (!tool) if (!Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_hoe')) return;
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Use the Superbreaker Mining Ability [\d]* times/.test(o)) {
					const event = this.registerChat('**SUPER BREAKER ACTIVATED**', () => {
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Vote for the Server [\d,]* times/.test(o)) {
					const event = this.registerChat(`| VOTE | ${Player.getName()} voted on \${server} +1 Voting Shard!`, () => {
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Earn [\d,]* McMMO Levels/.test(o)) {
					const event = this.registerChat('| MCMMO | ${skill} increased to ${level}.', (skill, level) => {
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
				if (/Loot [\d]* Chambers/.test(o)) {
					const event = this.registerChat('| CHAMBERS | You just looted a ${chamber} Chamber!', (chamber) => {
						this.DB.active[questName].progress++;
					});
					this.questTracker[questName] = event;
				}
			});
		});
	}
}
module.exports = {
	class: new QuestDisplay(),
};
