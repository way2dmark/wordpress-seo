export const UPDATE_EDITOR_DATA = "UPDATE_EDITOR_DATA";
export const SET_CONTENT = "SET_CONTENT";
export const SET_TITLE = "SET_TITLE";
export const SET_EXCERPT = "SET_EXCERPT";
export const SET_SLUG = "SET_SLUG";

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
 * Sets the excerpt in redux.
 *
 * @param {string} excerpt The excerpt.
 *
 * @returns {Object} An action for redux.
 */
export function setExcerpt( excerpt ) {
	return {
		type: SET_EXCERPT,
		excerpt,
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
