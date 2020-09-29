/* global jQuery, elementor, $e, elementorFrontend */
import { registerReactComponent } from "../helpers/reactRoot";
import YoastView from "../elementor/YoastView";
import { get } from "lodash";

/**
 * Adds the Yoast region to the Elementor regionviews.
 *
 * @param {array} regions The regions to be filtered.
 * @returns {array} The filtered regions.
 */
const addYoastRegion = ( regions ) => {
	regions.yoast = {
		region: regions.global.region,
		view: YoastView,
		options: {},
	};

	return regions;
};

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
const activateSaveButton = () => {
	const footerSaver = get( elementor, "saver.footerSaver", false );
	if ( false !== footerSaver ) {
		footerSaver.activateSaveButtons( document, true );
		return;
	}
	elementor.channels.editor.trigger( "status:change", true );
};

/**
 * Copies the current value to the oldValue.
 *
 * @param {HTMLElement} input The input element.
 *
 * @returns {void}
 */
const storeValueAsOldValue = ( input ) => {
	input.oldValue = input.value;
};

/**
 * Activates the save button if a change is detected.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {void}
 */
const detectChange = input => {
	if ( input.value !== input.oldValue ) {
		activateSaveButton();
		storeValueAsOldValue( input );
	}
};

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @param {Object} store The Yoast editor store.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration( store ) {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

	jQuery( function() {
		elementor.once( "preview:loaded", () => {
			// Connects the tab to the panel.
			$e.components
				.get( "panel/elements" )
				.addTab( "yoast", { title: "Yoast SEO" } );
		} );
	} );

	jQuery( window ).on( "elementor:init", () => {
		// Adds the tab to the template.
		const templateElement = document.getElementById( "tmpl-elementor-panel-elements" );
		templateElement.innerHTML = templateElement.innerHTML.replace(
			/(<div class="elementor-component-tab elementor-panel-navigation-tab" data-tab="global">.*<\/div>)/,
			"$1<div class=\"elementor-component-tab elementor-panel-navigation-tab elementor-active\" data-tab=\"yoast\">Yoast SEO</div>",
		);

		elementor.hooks.addFilter(
			"panel/elements/regionViews",
			addYoastRegion,
		);
	} );

	const yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}
