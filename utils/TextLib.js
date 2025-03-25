import ColorCode from './ColorCode';
import Render from './Render';
const Color = java.awt.Color;

export default class TextLib {
	static convertStyle({ color, bold, italic, underlined, strikethrough, obfuscated }) {
		color = color?.getName() || 'white';
		if (color[0] != '#') color = ColorCode[color.toUpperCase()];
		else color = '§' + color;
		let modifier = '';
		if (bold) modifier += '§l';
		if (italic) style += '§o';
		if (underlined) style += '§n';
		if (strikethrough) style += '§m';
		if (obfuscated) style += '§k';
		return { color, modifier };
	}
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
		this.text = new TextComponent(...args);
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
			const { color, modifier } = TextLib.convertStyle(sibling.getStyle());
			return (acc += color + modifier + sibling.getString());
		}, '');
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
	toString() {
		return this.text.toString();
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
