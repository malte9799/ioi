const Color = java.awt.Color;

const mapStyle = (s) => ({ color: s.color?.getName() || 'white', decoration: { bold: s.bold, italic: s.italic, underlined: s.underlined, strikethrough: s.strikethrough, obfuscated: s.obfuscated } });
const ColorCode = {
	BLACK: '§0',
	DARK_BLUE: '§1',
	DARK_GREEN: '§2',
	DARK_AQUA: '§3',
	DARK_RED: '§4',
	DARK_PURPLE: '§5',
	GOLD: '§6',
	GRAY: '§7',
	DARK_GRAY: '§8',
	BLUE: '§9',
	GREEN: '§a',
	AQUA: '§b',
	RED: '§c',
	LIGHT_PURPLE: '§d',
	YELLOW: '§e',
	WHITE: '§f',

	OBFUSCATED: '§k',
	BOLD: '§l',
	STRIKETHROUGH: '§m',
	UNDERLINE: '§n',
	ITALIC: '§o',
	RESET: '§r',
};

export default class TextComponent_ {
	constructor(...args) {
		args = args.map((e) => {
			if (typeof e !== 'string' || !e.includes('§#')) return e;
			return e.match(/§#[0-9A-F]{6}.*?($|(?=§))/g).reduce((acc, match) => {
				const color = match.slice(1, 8);
				const text = match.slice(8);
				acc.push(new TextComponent({ text, color: Color.decode(color).getRGB() }));
				return acc;
			}, []);
		});
		if (args.length == 1 && args[0] instanceof TextComponent) this.text = args[0];
		else this.text = new TextComponent(...args);
		this.formattedText = this.text.formattedText;
		this.unformattedText = this.text.unformattedText;
		this.size = this.text.size;
		return this;
	}

	getColorString() {
		const siblings = this.text.getSiblings() || [];
		siblings.unshift(this.text);
		return siblings.reduce((acc, sibling) => {
			if (!sibling) return acc;

			let { color, decoration } = mapStyle(sibling.getStyle());
			if (color[0] == '#') color = '§' + color;
			else color = ColorCode[color.toUpperCase()];
			const modifier = Object.entries(decoration).reduce((acc, [key, value]) => {
				acc += value ? ColorCode[key.toUpperCase()] || '' : '';
				return acc;
			}, '');

			return (acc += color + modifier + sibling.getString());
		}, '');
	}
	toString() {
		return this.getColorString();
	}
	actionBar() {
		this.text.actionBar();
	}
	asOrderedText() {
		return this.text.asOrderedText();
	}
	chat() {
		this.text.chat();
	}
	contains(element) {
		return this.text.contains(element);
	}
	containsAll(elements) {
		return this.text.containsAll(elements);
	}
	delete() {
		return this.text.delete();
	}
	edit(newText) {
		return this.text.edit(newText);
	}
	get(index) {
		return this.text.get(index);
	}
	getChatLineId() {
		return this.text.getChatLineId();
	}
	getContents() {
		return this.text.getContents();
	}
	getSiblings() {
		return this.text.getSiblings();
	}
	getString() {
		return this.text.getString();
	}
	getStyle() {
		return this.text.getStyle();
	}
	indexOf(element) {
		return this.text.indexOf(element);
	}
	isEmpty() {
		return this.text.isEmpty();
	}
	isRecursive() {
		return this.text.isRecursive();
	}
	iterator() {
		return this.text.iterator();
	}
	lastIndexOf(element) {
		return this.text.lastIndexOf(element);
	}
	listIterator(index = undefined) {
		return this.text.listIterator(index);
	}
	splitIterator() {
		return this.text.splitIterator();
	}
	subList(fromIndex, toIndex) {
		return this.text.subList(fromIndex, toIndex);
	}
	withChatLineId(chatLineId = undefined) {
		return this.text.withChatLineId(chatLineId);
	}
	withRecursive(recursive = true) {
		return this.text.withRecursive(recursive);
	}
	withText(value) {
		return this.text.withText(value);
	}
	withTextAt(index, value) {
		return this.text.withTextAt(index, value);
	}
}
