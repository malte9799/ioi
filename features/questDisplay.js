/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import huds from '../huds';
import settings from '../settings';
import db from '../db';

const Background = com.chattriggers.ctjs.api.render.Display.Background;
const fishRarity = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique', 'ethereal', 'mythic', 'boss'];

const textHud = huds.createTextHud('Quest Display', 120, 10, '');

textHud.onDraw((x, y, str) => {
	Renderer.pushMatrix();
	Renderer.translate(x, y);
	Renderer.scale(textHud.getScale());
	Renderer.drawStringWithShadow(str, 0, 0);
	Renderer.popMatrix();
});

function toId(name) {
	return name.replaceAll(' ', '_').toLowerCase().replace('coal', 'coal_ore');
}
function inWorld(world) {
	return () => World.toMC()?.getRegistryKey()?.getValue()?.toString() == world;
}
function holding(item) {
	return () => Player.getHeldItem()?.getType()?.getRegistryName()?.includes(item) ?? false;
}
class questDisplay extends Feature {
	constructor() {
		super();

		this.description = 'Displays active quests and thair perogress in a customizable Scoreboard.';

		this.isDefaultEnabled = true;

		this.quests = [];

		this.displayHeader = '§6§l    Active Quests    ';
		this.display = new Display({ x: 4, y: Renderer.screen.getHeight() / 2, background: Background.FULL });
	}

	initSettings() {
		settings.addProperty('PARAGRAPH', {
			name: 'Quest Template',
			description: 'Template string. \nVariables: {name} {obj} {progress} {goal} {percent}',
			category: 'Quest Display',
			subcategory: '',
			value: '&6&l| &e{name}: &7[&r{percent}%&7]\n&6&l|  &r{obj}: &a{progress}&7/&c{goal}',
		});
	}

	onEnable() {
		db.quests?.forEach((e) => {
			this.quests.push(new Quest(this, e.name, e.objective, e.progress, e.goal));
		});
		this.registerEvent('guiOpened', (gui, event) => {
			if (gui.getTitle().getString() !== 'Active Quests') return;
			Client.scheduleTask(1, () => {
				try {
					this.quests.forEach((e) => e.delete());
					this.quests = [];

					const items = Player.getContainer().getItems();
					const questItems = [...items.slice(28, 35), ...items.slice(37, 44)];

					questItems.forEach((item) => {
						if (!item || !ChatLib.removeFormatting(item.getName()) || !item.getLore()) return;
						const lore = item
							.getLore()
							.map((e) => ChatLib.removeFormatting(e))
							.filter((e) => e);
						if (lore.length > 7) return; // Exclude quests with multiple Objectives
						const name = lore[0];
						const [progress, goal] = lore[4].match(/(\d+)\/(\d+)/).slice(1);
						const objective = lore[6].slice(3);
						if (!this.quests.some((e) => e.name == name)) {
							this.quests.push(new Quest(this, name, objective, progress, goal));
						} else {
							this.quests.find((e) => e.name == name).progress = progress;
						}
					});
					this.quests.sort((a, b) => b.percent - a.percent);
				} catch (e) {
					logger.warn(JSON.stringify(e, undefined, 2));
					if (e.stack) logger.warn(e.stack);
				}
			});
		});
		this.registerChat('| QUESTS | You completed ${questName}!', (questName) => {
			const index = this.quests.findIndex((e) => e.name == questName);
			if (index == -1) return;
			this.quests[index].delete();
			this.quests.splice(index, 1);
		});
		this.registerChat('| QUESTS | You have satisfied the quest requirement for ranking up to ${*}', () => {
			this.quests.forEach((e) => e.delete());
			this.quests = [];
			db.quests = [];
		});

		this.registerEvent('renderOverlay', () => {
			textHud.text = this.displayHeader + '\n';
			textHud.text += this.quests
				.slice(0, 5)
				.map((e) => e.toString())
				.join('\n');

			textHud._getTextSize();
			Renderer.pushMatrix().translate(textHud.getX(), textHud.getY()).scale(textHud.getScale());
			Renderer.drawRect(Renderer.getColor(0, 0, 0, 80), -2, -2, textHud.getWidth() + 4, textHud.getHeight() + 4);
			// Renderer.drawStringWithShadow(textHud.text, 0, 0);
			Renderer.drawString(textHud.text, 0, 0);
			Renderer.popMatrix();
		});
		this.registerStep(false, 1, () => {
			this.quests.sort((a, b) => b.percent - a.percent);
		});
	}
}
module.exports = {
	class: new questDisplay(),
};

class Quest {
	constructor(parent, name, objective, progress, goal) {
		this.p = parent;
		this.name = name;
		this.objective = objective;
		this.progress = parseInt(progress);
		this.goal = parseInt(goal);

		const data = {
			name: this.name,
			goal: this.goal,
			progress: this.progress,
			objective: this.objective,
		};
		const index = db.quests.findIndex((e) => e.name == name);
		if (index != -1) {
			db.quests[index] = data;
		} else {
			db.quests.push(data);
		}

		this.trigger = this.registerTrigger();
	}

	get percent() {
		return Math.round((this.progress / this.goal) * 10000) / 100;
	}
	get objectiveShort() {
		return this.objective
			.replace(/ [\d,$]+( times)?/g, '')
			.replace(' for at least hours', '')
			.replace('Use the Superbreaker Mining Ability', 'Use Superbreaker');
	}

	toString() {
		const temp = settings.getValue('Quest Template');
		return temp.replaceAll('{name}', this.name).replaceAll('{objective}', this.objectiveShort).replaceAll('{obj}', this.objectiveShort).replaceAll('{progress}', this.progress).replaceAll('{goal}', this.goal).replaceAll('{percent}', this.percent);
	}

	addProgress(count = 1) {
		this.progress += count;
		db.quests.find((e) => e.name == this.name).progress = this.progress;
	}

	delete() {
		// this.trigger.unregister();
		this.p.FeatureManager.unregisterEvent(this.trigger);
		db.quests.splice(
			db.quests.findIndex((e) => e.name == this.name),
			1
		);
	}

	registerTrigger() {
		const o = this.objectiveShort;

		if (/(Mine|Dig up|Dig) [a-zA-Z ]+/.test(o)) {
			const filterBlock = toId(o.match(/(?:Mine|Dig up|Dig) ([a-zA-Z ]+)/)[1]);
			return this.p
				.registerEvent('blockBreak', (block) => {
					const blockName = block.type.getRegistryName().slice(10);
					if (filterBlock !== 'blocks' && blockName !== filterBlock) return;
					this.addProgress();
				})
				.when(inWorld('minecraft:mines') || inWorld('minecraft:spawn'));
		}
		if (o == 'Collect Logs') {
			return this.p
				.registerEvent('blockBreak', (block) => {
					if (!/minecraft:\w*_log/.test(block.type.getRegistryName())) return;
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (o == 'Chop Warped Hyphae') {
			return this.p
				.registerEvent('blockBreak', (block) => {
					if (block.type.getRegistryName() !== 'minecraft:warped_hyphae') return;
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (o == 'Harvest Crops') {
			return this.p
				.registerEvent('blockBreak', (block) => {
					if (!/minecraft:(wheat|beetroots|carrots|potatoes)/.test(block.type.getRegistryName())) return;
					const fullyGrown = block
						.getState()
						.getEntries()
						.entrySet()
						.stream()
						.anyMatch((e) => e.getKey().getValues().getLast() == e.getValue());
					if (!fullyGrown) return;

					this.addProgress();
				})
				.when(inWorld('minecraft:cells'));
		}
		if (o == 'Catch Fish') {
			return this.p
				.registerChat('| FISH | ${player} caught a ${*}cm ${*}!', (player) => {
					if (player !== 'You' && player !== Player.getName()) return;
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'), holding('fishing_rod'));
		}
		if (/Catch \w*\+ Fish/.test(o)) {
			return this.p
				.registerChat('| FISH | ${player} caught a ${*}cm ${rarity} ${*}!', (player, rarity) => {
					if (player !== 'You' && player !== Player.getName()) return;
					const rarity = o.match(/Catch (\w*)\+ Fish/)[1].toLowerCase();
					const rarityList = fishRarity.slice(fishRarity.indexOf(rarity));

					if (!rarityList.includes(rarity.toLowerCase())) return;
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'), holding('fishing_rod'));
		}
		if (o == 'Sell from Fishing Nets') {
			return this.p.registerChat('You sold ${*} Fish for $${price}', (price) => {
				this.addProgress(price);
			});
		}
		if (o == 'Find Mine Crates') {
			return this.p
				.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:mines') || inWorld('minecraft:spawn'), holding('pickaxe'));
		}
		if (o == 'Find Fishing Crates') {
			return this.p
				.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'), holding('fishing_rod'));
		}
		if (o == 'Find Farming Crates') {
			return this.p
				.registerChat('| CRATES | You just received a crate. Claim it with /claim!', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:cells'), holding('_hoe'));
		}
		if (o == 'Use Superbreaker') {
			return this.p
				.registerChat('**SUPER BREAKER ACTIVATED**', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:mines') || inWorld('minecraft:spawn'));
		}
		if (o == 'Vote for the Server') {
			return this.p.registerChat(`| VOTE | ${Player.getName()} voted on \${server} +1 Voting Shard!`, () => {
				this.addProgress();
			});
		}
		if (o == 'Earn McMMO Levels') {
			return this.p.registerChat('| MCMMO | ${skill} increased to ${level}.', (skill, level) => {
				this.addProgress();
			});
		}
		if (o == 'Loot a Chamber' || o == 'Loot Chamber' || o == 'Loot Chambers') {
			return this.p
				.registerChat('| CHAMBERS | You just looted a ${*} Chamber!', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:mines') || inWorld('minecraft:spawn'));
		}
		if (o == 'Open any Crate Keys' || o == 'Open Keys') {
			return this.p
				.registerChat('| KEYS | You have received ${*} [${*}]!', () => {
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (/Open [a-zA-Z]+ Keys/.test(o)) {
			const crates = {
				token: 'minecraft:ender_chest',
				prison: 'minecraft:cauldron',
				enchanter: 'minecraft:enchanting_table',
			};
			return this.p
				.registerChat('| KEYS | You have received ${*} [${*}]!', () => {
					const crate = crates[o.match(/Open ([a-zA-Z]+) Keys/)[1].toLowerCase()];
					if (!crate || crate !== Player.lookingAt()?.getType()?.getRegistryName()) return;
					this.addProgress();
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (o == 'Rent a cell') {
			return this.p
				.registerChat('You have been charged $2.50k to claim this shop', () => {
					this.addProgress(24);
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (o == 'Rent a Mall Shop') {
			return this.p
				.registerChat('You have been charged $5.00k to claim this shop', () => {
					this.addProgress(24);
				})
				.when(inWorld('minecraft:spawn'));
		}
		if (/Sell [a-zA-Z ]+ to the Server Shop/.test(o)) {
			return this.p.registerChat('| SHOPS | You sold ${count} ${item} for $${*}!', (count, item) => {
				if (item !== o.match(/Sell ([a-zA-Z ]+) to the Server Shop/)[1]) return;
				this.addProgress(count);
			});
		}
		if (o == 'Participate in Vote Parties') {
			return this.p.registerChat('The vote party has ended, thank you for voting and claiming your reward.', () => {
				this.addProgress();
			});
		}
		// if (o == 'Fish up a Fishing net') {
		// 	return true;
		// }
	}
}
