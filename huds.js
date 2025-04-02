import db from 'ioi/db';
import RenderLib2d from 'ioi/utils/RenderLib2d';
import { OutlineMode } from 'ioi/utils/RendererUtils';

// Copy of Krun but Updated to 1.21.4
const drawCentered = (str, yPadding = 0) => {
	Renderer.drawStringWithShadow(str, (Renderer.screen.getWidth() - Renderer.getStringWidth(str.removeFormatting())) / 2, Renderer.screen.getHeight() / 2 + yPadding);
};

class Huds {
	/**
	 * @param {{}} obj The module's data object
	 * @param {boolean} drawBackground Whether to draw a semi-transparent dark background (`true` by default)
	 */
	constructor(obj, drawBackground = true) {
		this.obj = obj;
		this.drawBackground = drawBackground;
		this.gui = new Gui();
		/** @type {Hud[]} @private */
		this.huds = [];
		/** @type {Hud?} @private */
		this._currentHud = null;

		// Listeners
		this.gui.registerClicked(this._onClick.bind(this));
		this.gui.registerScrolled(this._onScroll.bind(this));
		// Better for smoother moving
		register('dragged', (dx, dy, _, __, mbtn) => {
			if (!Client.isInGui() || !this.isOpen()) return;

			this._onDragged(dx, dy, mbtn);
		});
		this.gui.registerDraw(this._onDraw.bind(this));
	}

	/**
	 * * Internal use.
	 * * Used to detect which [Hud] was clicked and/or lost focus
	 * @private
	 */
	_onClick(x, y, mbtn) {
		if (mbtn !== 0) return;

		for (let hud of [...this.huds]) {
			if (hud.inBounds(x, y)) {
				this._currentHud = hud;
				break;
			} else if (this._currentHud) {
				this._currentHud = null;
			}
		}
	}

	/**
	 * * Internal use.
	 * @private
	 */
	_onScroll(_, __, dir) {
		if (!this._currentHud) return;
		// Do custom resize logic
		if (Client.isShiftDown() && this._currentHud.resizable) {
			if (dir === 1) this._currentHud.width += this._currentHud.resizeJump;
			else this._currentHud.width -= this._currentHud.resizeJump;
			return;
		}
		if (Client.isControlDown() && this._currentHud.resizable) {
			if (dir === 1) this._currentHud.height += this._currentHud.resizeJump;
			else this._currentHud.height -= this._currentHud.resizeJump;
			return;
		}

		if (dir === 1) this._currentHud.scale += 0.02;
		else this._currentHud.scale -= 0.02;
	}

	/**
	 * * Internal use.
	 * @private
	 */
	_onDragged(dx, dy, mbtn) {
		if (mbtn !== 0) return;
		if (!this._currentHud) return;
		this._currentHud._onDragged(dx, dy);
	}

	/**
	 * * Internal use.
	 * @private
	 */
	_onDraw(x, y, _) {
		if (this.drawBackground) {
			Renderer.drawRect(Renderer.getColor(0, 0, 0, 150), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight());
		}
		for (let hud of [...this.huds]) {
			hud._triggerDraw(x, y);
			hud._drawBackground();
		}

		if (this._currentHud) {
			drawCentered(`&bCurrently editing&f: &6${this._currentHud.name}`);
			if (this._currentHud.text) drawCentered('&eUse &ascroll wheel&e to scale the text in size', 9);
			else {
				let y = 9;
				if (this._currentHud.resizable) {
					drawCentered('&eUse &ashift&e + &ascroll wheel&e to change the width size', 9);
					drawCentered('&eUse &actrl&e + &ascroll wheel&e to change the height size', 18);
					y += 18;
				}
				drawCentered('&eUse &ascroll wheel&e to scale the hud in size', y);
			}
		}
	}

	/**
	 * * Opens this [Huds] gui
	 * @returns this for method chaining
	 */
	open() {
		this.gui.open();
		return this;
	}

	/**
	 * * Closes this [Huds] gui
	 * @returns this for method chaining
	 */
	close() {
		this.gui.close();
		return this;
	}

	/**
	 * * Checks whether this [Huds] gui is opened
	 * @returns {boolean}
	 */
	isOpen() {
		return this.gui.isOpen();
	}

	/**
	 * * Saves the data into the [obj]
	 * * Note: this does not call `save` in `PogData` you have to do that manually
	 * @returns this for method chaining
	 */
	save() {
		for (let hud of [...this.huds]) hud._save(this.obj);
		return this;
	}

	/**
	 * * Makes a hud that can be dragged and scaled
	 * @param {string} name
	 * @param {number?} x
	 * @param {number?} y
	 * @param {number?} width
	 * @param {number?} height
	 * @returns {Hud}
	 */
	createHud(name, x = 0, y = 0, width = 0, height = 0) {
		const hud = new Hud(name, this.obj[name] ?? { x, y, width, height });
		this.huds.push(hud);
		return hud;
	}

	/**
	 * * Makes a hud that can be dragged and scaled as well as having custom resize logic
	 * * i.e. if you `shift` + `scroll` it'll make the `width` go up/down, same with `ctrl` + `scroll` it'll do the same with `height`
	 * @param {string} name
	 * @param {number?} x
	 * @param {number?} y
	 * @param {number?} width
	 * @param {number?} height
	 * @returns {Hud}
	 */
	createResizableHud(name, x = 0, y = 0, width = 0, height = 0) {
		const hud = new Hud(name, this.obj[name] ?? { x, y, width, height });
		hud.resizable = true;
		this.huds.push(hud);
		return hud;
	}

	/**
	 * * Makes a hud that can be dragged and scaled for strings
	 * @param {string} name
	 * @param {number?} x
	 * @param {number?} y
	 * @param {string} text
	 * @returns {Hud}
	 */
	createTextHud(name, x = 0, y = 0, text) {
		const hud = new Hud(name, this.obj[name] ?? { x, y }, text);
		this.huds.push(hud);
		return hud;
	}
}

class Hud {
	constructor(name, obj, text) {
		this.name = name;
		/** @private */
		this.x = obj.x ?? 0;
		/** @private */
		this.y = obj.y ?? 0;
		/** @private */
		this.scale = obj.scale ?? 1;
		/** @private */
		this.width = obj.width ?? 0;
		/** @private */
		this.height = obj.height ?? 0;
		this.text = text;
		/** @private */
		this.resizable = false;
		/**
		 * * Change this field if you want the custom resize to change more height/width
		 * * Default value is `1`
		 */
		this.resizeJump = 1;

		/** @private */
		this._onDraw = null;
		/** @private */
		this._hovering = false;
		/** @private */
		this._normalBackground = Renderer.getColor(70, 70, 70);
		/** @private */
		this._hoverBackground = Renderer.getColor(150, 150, 150);

		if (this.text) this._getTextSize();
	}

	/**
	 * * Adds a listeners that triggers whenever this [Hud] is being drawn in the editing gui
	 * * Note: if the hud is a `Text Hud` the params will be: `(x, y, text)` otherwise: `(x, y, width, height)`
	 * @param {(x: number, y: number, text: string?, width: number?, heigt: number?) => void} cb
	 */
	onDraw(cb) {
		this._onDraw = cb;
	}

	/**
	 * @returns {number}
	 */
	getX() {
		return this.x ?? 0;
	}

	/**
	 * @returns {number}
	 */
	getY() {
		return this.y ?? 0;
	}

	/**
	 * @returns {number}
	 */
	getWidth() {
		return this.width ?? 0;
	}

	/**
	 * @returns {number}
	 */
	getHeight() {
		return this.height ?? 0;
	}

	/**
	 * @returns {number}
	 */
	getScale() {
		return this.scale ?? 1;
	}

	/**
	 * * Gets the position of this [Hud] taking into consideration the scale factor
	 * @returns {number[]}
	 */
	getPos() {
		return [this.x, this.y, this.width * this.scale, this.height * this.scale];
	}

	/**
	 * * Gets the boundaries of this [Hud]
	 * * Note: the scaling factor is only applied to the `width` and `height`
	 * @returns {number[]}
	 */
	getBounds() {
		return [this.x, this.y, this.x + this.width * this.scale, this.y + this.height * this.scale];
	}

	/**
	 * * Checks whether the given `x, y` are in the bounds of this [Hud]
	 * @returns {boolean}
	 */
	inBounds(x, y) {
		const [x1, y1, x2, y2] = this.getBounds();
		return x >= x1 && x <= x2 && y >= y1 && y <= y2;
	}

	/** @private */
	_getTextSize() {
		this.width = Renderer.getStringWidth(this.text);
		const m = this.text.match(/\n/g);
		if (m == null) return (this.height = 9);
		this.height = 9 * (m.length + 1);
		this.width = 0;
		this.text.split('\n').forEach((it) => {
			this.width = Math.max(this.width, Renderer.getStringWidth(it));
		});
	}

	/** @private */
	_save(obj) {
		obj[this.name] = {
			x: this.getX(),
			y: this.getY(),
			scale: this.getScale(),
			width: this.getWidth(),
			height: this.getHeight(),
		};
	}

	/** @private */
	_drawBackground() {
		const color = this._hovering ? this._hoverBackground : this._normalBackground;

		Renderer.pushMatrix().translate(this.x, this.y).scale(this.scale).enableDepth();
		Renderer.drawRect(color, -1, -1, this.width + 2, this.height + 2);
		Renderer.popMatrix();
	}

	/** @private */
	_triggerDraw(x, y) {
		if (this._onDraw) {
			if (!this.text) this._onDraw(this.x, this.y, this.width, this.height);
			else this._onDraw(this.x, this.y, this.text);
		}
		this._hovering = this.inBounds(x, y);
	}

	/** @private */
	_onDragged(dx, dy) {
		this.x = Math.max(2, Math.min(this.x + dx, Renderer.screen.getWidth() - this.width * this.scale - 2));
		this.y = Math.max(2, Math.min(this.y + dy, Renderer.screen.getHeight() - this.height * this.scale - 2));
	}
}
//

//
if (!global.ioi.huds) {
	if (!db.huds) db.huds = {};
	const huds = new Huds(db.huds);
	global.ioi.huds = huds;

	register('gameUnload', () => {
		if (!global.ioi.huds) return;
		global.ioi.huds.save();
		global.ioi.huds = undefined;
	});
}

export default global.ioi.huds;
