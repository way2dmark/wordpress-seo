export const UPDATE_EDITOR_DATA = "UPDATE_EDITOR_DATA";
export const SET_CONTENT = "SET_CONTENT";
export const SET_TITLE = "SET_TITLE";
export const SET_DESCRIPTION = "SET_DESCRIPTION";
export const SET_SLUG = "SET_SLUG";
export const SET_BASE_URL = "SET_BASE_URL";
export const SET_KEYPHRASE = "SET_KEYPHRASE";
export const SET_SYNONYMS = "SET_SYNONYMS";

/**
 * Updates the editor data in redux.
 *
 * @param {Object} editorData The editor data.
 *
 * @returns {Object} An action for redux.
 */
export function updateEditorData( editorData ) {
	return {
		type: UPDATE_EDITOR_DATA,
		editorData,
	};
}

/**
 * Sets the content in redux.
 *
 * @param {string} content The content.
 *
 * @returns {Object} An action for redux.
 */
export function setContent( content ) {
	return {
		type: SET_CONTENT,
		content,
	};
}

/**
 * Sets the title in redux.
 *
 * @param {string} title The title.
 *
 * @returns {Object} An action for redux.
 */
export function setTitle( title ) {
	return {
		type: SET_TITLE,
		title,
	};
}

/**
 * Sets the slug in redux.
 *
 * @param {string} slug The slug.
 *
 * @returns {Object} An action for redux.
 */
export function setSlug( slug ) {
	return {
		type: SET_SLUG,
		slug,
	};
}

/**
 * Sets the baseUrl in redux.
 *
 * @param {string} baseUrl The baseUrl.
 *
 * @returns {Object} An action for redux.
 */
export function setBaseUrl( baseUrl ) {
	return {
		type: SET_BASE_URL,
		baseUrl,
	};
}

/**
 * Sets the keyphrase in redux.
 *
 * @param {string} keyphrase The keyphrase.
 *
 * @returns {Object} An action for redux.
 */
export function setKeyphrase( keyphrase ) {
	return {
		type: SET_KEYPHRASE,
		keyphrase,
	};
}

/**
 * Sets the synonyms in redux.
 *
 * @param {string} synonyms The synonyms.
 *
 * @returns {Object} An action for redux.
 */
export function setSynonyms( synonyms ) {
	return {
		type: SET_SYNONYMS,
		synonyms,
	};
}
