import {
	UPDATE_EDITOR_DATA,
	SET_CONTENT,
	SET_TITLE,
	SET_EXCERPT,
	SET_SLUG,
} from "../actions/editorData";

const INITIAL_STATE = {
	content: "",
	title: "",
	excerpt: "",
	slug: "",
};

/* eslint-disable complexity */
/**
 * Reduces the dispatched action for the editorData state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function editorDataReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case UPDATE_EDITOR_DATA:
			return {
				...state,
				...action.editorData,
			};
		case SET_CONTENT:
			return {
				...state,
				content: action.content,
			};
		case SET_TITLE:
			return {
				...state,
				title: action.title,
			};
		case SET_EXCERPT:
			return {
				...state,
				excerpt: action.excerpt,
			};
		case SET_SLUG:
			return {
				...state,
				slug: action.slug,
			};
	}
	return state;
}

/* eslint-enable complexity */
export default editorDataReducer;
