import { excerptFromContent } from "../helpers/replacementVariableHelpers";

/**
 * Gets the post content.
 *
 * @returns {string} The post's content.
 */
function getContent() {
	const content = [];

	window.elementor.$preview.contents().find( "[data-elementor-type]" ).find( ".elementor-widget-container" ).each( ( index, element ) => {
		content.push( element.innerHTML.trim() );
	} );

	return content.join( "" );
}

/**
 * Gets the excerpt from the post.
 *
 * @param {boolean} useFallBack Whether the fallback for content should be used.
 * @param {string} content The post content.
 *
 * @returns {string} The excerpt.
 */
function getExcerpt( useFallBack = true, content = "" ) {
	const excerpt = window.elementor.settings.page.model.get( "post_excerpt" );
	if ( excerpt !== "" || useFallBack === false ) {
		return excerpt;
	}

	return excerptFromContent( content );
}

function getEditorData() {
	if ( ! window.elementor ) {
		return {
			content: "",
			title: "",
			description: "",
			slug: "",
			baseUrl: "",
			keyphrase: "",
			synonyms: "",
		};
	}

	return {
		content: getContent(),
		title: window.elementor.settings.page.model.get( "post_title" ),
		description: getExcerpt(),
		slug: "",
		baseUrl: "",
		keyphrase: "",
		synonyms: "",
	};
}
