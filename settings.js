import logger from './logger.js';
import metadata from './metadata.js';
// import ret from "./utils/renderUtils.js";

// prettier-ignore
import {
  Color,
  createPropertyAttributesExt,
  @Vigilant
} from '../Vigilance';

const PropertyData = Java.type("gg.essential.vigilance.data.PropertyData");
const PropertyType = Java.type('gg.essential.vigilance.data.PropertyType');
const PropertyValue = Java.type('gg.essential.vigilance.data.PropertyValue');
const CallablePropertyValue = Java.type('gg.essential.vigilance.data.CallablePropertyValue');

const formatName = (string) => {
	// console.log(string)
	if (!string) return;
	return (string.charAt(0).toUpperCase() + string.slice(1)).match(/[A-Z][a-z]+/g).join(' ');
};

/**
 * Puts the first Element on an Array to the end. (ABCD -> BCDA)
 * @param {Array} input
 * @returns {Array}
 */
const swap = (input) => {
	// argb -> rgba
	let inputCopy = [...input];
	let first = inputCopy.splice(0, 1);
	return [...inputCopy, ...first];
};

/**
 * Property Function Storage. Used for Buttons
 * @param {Object} propData
 */
const JSFunctionCallableValue = (propData) => ({
	invoke() {
		propData.value();
	},
	setValue(value, instance) {},
	getValue(instance) {},
});

/**
 * Property Value Storage. Used for everything except Buttons
 * @param {Class} config Settings Class
 * @param {String} propname Name of the Setting
 * @param {String} type Type of the Input (Integer, Float, Color)
 */
const JSBackedPropertyValue = (config, propName, type) => ({
	getPropName() {
		return propName;
	},
	getValue() {
		if (type == 'Integer') return new java.lang.Integer(config[propName]);
		if (type == 'Float') return new java.lang.Float(config[propName]);
		if (type == 'Color' && typeof config[propName] === 'string')
			// string is argb (0-255) and java wants it as rgba (0-1)
			return new java.awt.Color(...swap(config[propName].split(',').map((a) => parseInt(a) / 255)));

		return config[propName];
	},
	setValue(newValue) {
		config[propName] = newValue;
	},
});

@Vigilant(metadata.name, '§6TrappedMC', {
	getCategoryComparator: () => (a, b) => {
		const categories = ['array of your category names'];

		let A = categories.indexOf(a.name) != -1 ? categories.indexOf(a.name) + 10 : 1;
		let B = categories.indexOf(b.name) != -1 ? categories.indexOf(b.name) + 10 : 0;

		if (a.name == 'Global') {
			B += 100;
		}
		if (b.name == 'Global') {
			A += 100;
		}

		return A - B;
	},
	getSubcategoryComparator: () => (a, b) => {
		return 1;
		const subcategories = ['array of your subcategory names'];

		return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) - subcategories.indexOf(b.getValue()[0].attributesExt.subcategory);
	},
	// getPropertyComparator: () => (a, b) => {
	//     let A = 1;
	//     let B = 0;
	//     // return A - B;

	//     if (a.attributesExt.category == 'Features' && b.attributesExt.category == 'Features') {
	//         if (a.getDataType() == 'SWITCH') {
	//             if (a.getAsBoolean()) A -= 100;
	//         }
	//         if (b.getDataType() == 'SWITCH') {
	//             if (b.getAsBoolean()) B -= 100;
	//         }
	//     }

	//     return 1;
	// }
})
class SettingsClass {
	constructor() {
		this.initialize(this);
		this.propertys = {};
		this.customDependencys = {};

		this.getSettingName = (propName) => {
			let prop = this.getProp(propName);
      if (!prop) return undefined;
			return prop.category === 'Features'
				? `${prop.name.toUpperCase().replaceAll(' ', '')}_mainToggle`
				: `${prop.category.toUpperCase().replaceAll(' ', '')}_${prop.name.toLowerCase().replaceAll(' ', '_')}`;
		};
		this.getValue = (propName) => {
			let prop = this.getProp(propName);
      if (!prop) return undefined;
			let settingname = this.getSettingName(propName);
			if (prop.type === 'COLOR') {
				if (typeof this[settingname] === 'string') {
					return this[settingname].split(','); // argb
				} else {
					return [this[settingname].getAlpha(), this[settingname].getRed(), this[settingname].getGreen(), this[settingname].getBlue()];
				}
			} else {
				return this[settingname];
			}
		};

		this.editProperty = (propName, key, value) => {
			let prop = this.getProp(propName);
      if (!prop) return undefined;
			let settingname = this.getSettingName(propName);

			console.dir(this[settingname]);
		};

    this.getProp = (propName) => {  
      let prop = this.propertys[propName];
			if (!prop) prop = this.propertys[formatName(propName)];
			if (!prop) {
        logger.error('Error getting Prop Value for ' + propName);
        return undefined;
      }
      return prop;
    }

		this.setCategoryOrder = (name, index) => {};

		/**
		 * Add a Properts to the Settings Menu
		 * @param {String} type Type of the Property [SWITCH | CHECKBOX | TEXT | PARAGRAPH | SELECTOR | NUMBER | SLIDER | PERCENT_SLIDER | DECIMAL_SLIDER | COLOR | BUTTON | CUSTOM]
		 * @param {Object} propData Property Data
		 * @param {String} propData[].name Name
		 * @param {String} propData[].description Description
		 * @param {String} propData[].category Category Name
		 * @param {String} propData[].subcategory Subcategory Name
		 * @param {String} propData[].placeholder Placeholder of TEXT and BUTTON
		 * @param {Array} propData[].options Options for SELECTOR
		 * @param {Number} propData[].min for all SLIDERS
		 * @param {Number} propData[].max for all SLIDERS
		 * @param {Number} propData[].minF for all SLIDERS
		 * @param {Number} propData[].maxF for all SLIDERS
		 * @param {Number} propData[].decimalPlaces for all SLIDERS
		 * @param {Number} propData[].increment for all SLIDERS
		 * @param {Boolean} propData[].allowAlpha Alpha for COLOR
		 * @param {Boolean} propData[].protected Protect the TEXT input
		 * @param {Boolean} propData[].triggerActionOnInitialization IDK
		 * @param {Boolean} propData[].hidden If the Option is Visible
		 * @param {Boolean} propData[].customPropertyInfo Used for Custom Propertys
		 * @param {String} dependency Add an Dependency to the Property (dependend must be SWITCH or CHECKBOX)
		 * @return {PropertyData} The Vigilance Property Data
		 */
		this.addProperty = (type, propData = {}, dependency = undefined) => {
			propData.type = type;

			if (this.propertys.hasOwnProperty(propData.name)) return;
			this.propertys[propData.name] = propData;
			try {
				const attributes = createPropertyAttributesExt(PropertyType[type], propData);
				settingname = this.getSettingName(propData.name);

				let inputType = '';

				switch (
					type // default
				) {
					// Bool
					case 'SWITCH':
					case 'CHECKBOX':
						this[settingname] = false;
						break;
					// String
					case 'TEXT':
					case 'PARAGRAPH':
						this[settingname] = '';
						break;
					// Integer
					case 'SELECTOR':
					case 'NUMBER':
					case 'SLIDER':
						this[settingname] = 0;
						inputType = 'Integer';
						break;
					// Float
					case 'PERCENT_SLIDER':
					case 'DECIMAL_SLIDER':
						this[settingname] = 0.0;
						inputType = 'Float';
						break;
					// Color
					case 'COLOR':
						this[settingname] = Color.WHITE;
						inputType = 'Color';
						break;
					// Function
					case 'BUTTON':
						this[settingname] = () => {};
						break;
					default:
						break;
				}

				if (propData.value) {
					this[settingname] = propData.value;
				}

				const action =
					type === 'BUTTON' ? new JavaAdapter(CallablePropertyValue, JSFunctionCallableValue(propData)) : new JavaAdapter(PropertyValue, JSBackedPropertyValue(this, settingname, inputType));

				const data = new PropertyData(attributes, action, this.getConfig());
				this.propertys[propData.name].propData = data;

				this.registerProperty(data);

				if (propData.category === 'Features') {
					data.setCallbackConsumer(() => {
						let name = data.attributesExt.name;
						let featureName = name.charAt(0).toLowerCase() + name.slice(1).replaceAll(' ', '');
						// this.featurManager.toggleFeature(featureName, !data.getAsBoolean());
					});
				}
				if (dependency) {
					if (dependency.includes(':')) {
						// SELECTOR
						let parent = dependency.split(':')[0];
						// let switchHelper = this.addProperty('SWITCH', {name: 'selector_dependendy '+ parent, description:'NOT FOR MANUEL USE!!', category:'Macros'})//.attributesExt.hidden = true
						this.customDependencys[parent] = {
							propData: data,
							value: dependency.split(':')[1],
            };
              // switchHelper}
              // this.addDependency(propData.name, 'selector_dependendy '+ parent)
						this.registerListener(parent, (newValue) => {
							let d = this.customDependencys[parent];
							// d.switchHelper.setValue(this.propertys[parent].options[parseInt(newValue)] === d.value)
							d.propData.attributesExt.hidden = this.propertys[parent].options[parseInt(newValue)] !== d.value;
						});
					} // SWITCH or CHECKBOX
					else  {
            if (Array.isArray(dependency)) {
              dependency.forEach((d) => {
                this.addDependency(propData.name, d);
              });
            } else {
              this.addDependency(propData.name, dependency);
            }
          }
				}
				return data;
			} catch (e) {
                logger.error('Error adding Property ' + propData.name);
                logger.warn(JSON.stringify(e, undefined, 2));
                logger.warn(e.stack)
                Console.printStackTrace(e)
                throw e
			}
		};
	}
}

if (!global.ioi.settings) {
	global.ioi.settings = new SettingsClass();
	register('gameUnload', () => {
		global.ioi.settings = undefined;
	});
}
export default global.ioi.settings;

// Settings.addProperty('SWITCH', {
// 	name: 'Example Switch',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// });

// Settings.addProperty('CHECKBOX', {
// 	name: 'Example Checkbox',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// });

// Settings.addProperty('TEXT', {
// 	name: 'Example Text',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	protected: true,
// 	value: 'EXAMPLE TEXT',
// });

// Settings.addProperty('PARAGRAPH', {
// 	name: 'Example Paragraph',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	value: 'EXAMPLE\nTEXT',
// });

// Settings.addProperty('SELECTOR', {
// 	name: 'Example Selector',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	options: ['1', '2', '3', '4', '5'],
// });

// Settings.addProperty('NUMBER', {
// 	name: 'Example Number',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// });

// Settings.addProperty('SLIDER', {
// 	name: 'Example Slider',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	min: 0,
// 	max: 100,
// 	value: 0,
// });

// Settings.addProperty('PERCENT_SLIDER', {
// 	name: 'Example Percent Slider',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	value: 0.5,
// });

// Settings.addProperty('DECIMAL_SLIDER', {
// 	name: 'Example Decimal Slider',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	minF: 0.0,
// 	maxF: 100.0,
// 	decimalPlaces: 1,
// 	value: 50.0,
// });

// Settings.addProperty('COLOR', {
// 	name: 'Example Color',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// });

// Settings.addProperty('BUTTON', {
// 	name: 'Example Button',
// 	descrption: '',
// 	category: 'Example',
// 	subcategory: '',
// 	placeholder: 'Placeholder Text',
// 	value() {
// 		ChatLib.chat('BUTTON PRESS');
// 	},
// });

