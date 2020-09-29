import {
	UPDATE_EDITOR_DATA,
	SET_CONTENT,
	SET_TITLE,
	SET_DESCRIPTION,
	SET_SLUG,
	SET_BASE_URL,
	SET_KEYPHRASE,
	SET_SYNONYMS,
} from "../actions/editorData";

const INITIAL_STATE = {
	content: "",
	title: "",
	description: "",
	slug: "",
	baseUrl: "",
	keyphrase: "",
	synonyms: "",
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
		case SET_DESCRIPTION:
			return {
				...state,
				description: action.description,
			};
		case SET_SLUG:
			return {
				...state,
				slug: action.slug,
			};
		case SET_BASE_URL:
			return {
				...state,
				baseUrl: action.baseUrl,
			};
		case SET_KEYPHRASE:
			return {
				...state,
				keyphrase: action.keyphrase,
			};
		case SET_SYNONYMS:
			return {
				...state,
				synonyms: action.synonyms,
			};
	}
	return state;
}

/* eslint-enable complexity */
export default editorDataReducer;
