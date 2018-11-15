/* External dependencies */
import isFunction from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";
import flatMap from "lodash/flatMap";
import { create } from "@wordpress/rich-text";
import { select, dispatch } from "@wordpress/data";
import { string } from "yoastseo";

const { stripHTMLTags } = string;

const ANNOTATION_SOURCE = "yoast";

let annotationQueue = [];

const ANNOTATION_ATTRIBUTES = {
	"core/quote": [
		{
			key: "value",
			multilineTag: "p",
		},
		{
			key: "citation",
		},
	],
	"core/paragraph": [
		{
			key: "content",
		},
	],
	"core/list": [
		{
			key: "values",
			multilineTag: "li",
			multilineWrapperTag: [ "ul", "ol" ],
		},
	],
	"core/heading": [
		{
			key: "content",
		},
	],
};

/**
 * Retrieves the next annotation from the annotation queue.
 *
 * @returns {Object} An annotation object that can be applied to Gutenberg.
 */
function getNextAnnotation() {
	return annotationQueue.shift();
}

/**
 * Applies the next time annotation in the queue.
 *
 * @returns {void}
 */
function applyAnnotationQueueItem() {
	const nextAnnotation = getNextAnnotation();

	if ( ! nextAnnotation ) {
		return;
	}

	dispatch( "core/annotations" ).__experimentalAddAnnotation( nextAnnotation );

	// eslint-disable-next-line no-use-before-define
	scheduleAnnotationQueueApplication();
}

/**
 * Schedules the application of the next available annotation in the queue.
 *
 * @returns {void}
 */
function scheduleAnnotationQueueApplication() {
	if ( isFunction( window.requestIdleCallback ) ) {
		window.requestIdleCallback( applyAnnotationQueueItem, { timeout: 1000 } );
	} else {
		setTimeout( applyAnnotationQueueItem, 150 );
	}
}

/**
 * Returns whether or not annotations are available in Gutenberg.
 *
 * @returns {boolean} Whether or not annotations are available in Gutenberg.
 */
export function isAnnotationAvailable() {
	return ! isUndefined( select( "core/editor" ) ) &&
		isFunction( select( "core/editor" ).getBlocks ) &&
		! isUndefined( select( "core/annotations" ) ) &&
		isFunction( dispatch( "core/annotations" ).__experimentalAddAnnotation );
}

/**
 * Returns the offsets of the <yoastmark> occurrences in the given mark.
 *
 * @param   {Mark} mark The mark object to calculate offset for.
 *
 * @returns {Array<{startOffset: number, endOffset: number}>} The start and end indices for this mark.
 */
function getOffsets( mark ) {
	let marked = mark.getMarked();

	const startMark = "<yoastmark class='yoast-text-mark'>";
	const endMark = "</yoastmark>";

	let startMarkIndex = marked.indexOf( startMark );
	let endMarkIndex = null;

	const offsets = [];

	while ( startMarkIndex >= 0 ) {
		marked = marked.replace( startMark, "" );
		endMarkIndex = marked.indexOf( endMark );

		if ( endMarkIndex < 0 ) {
			return null;
		}
		marked = marked.replace( endMark, "" );

		offsets.push( {
			startOffset: startMarkIndex,
			endOffset: endMarkIndex,
		} );

		startMarkIndex = marked.indexOf( startMark );
		endMarkIndex = null;
	}

	return offsets;
}

/**
 * Finds all indices for a given string in a text.
 *
 * @param {string}  text          Text to search through.
 * @param {string}  value         Text to search for.
 * @param {boolean} caseSensitive Should the search be case sensitive.
 *
 * @returns {Array} All indices of the found occurrences.
 */
function getIndicesOf( text, value, caseSensitive = true ) {
	const indices = [];

	if ( text.length  === 0 ) {
		return indices;
	}

	let startIndex = 0;
	let index;

	if ( ! caseSensitive ) {
		value = value.toLowerCase();
		text = text.toLowerCase();
	}

	while ( ( index = text.indexOf( value, startIndex ) ) > -1 ) {
		indices.push( index );
		startIndex = index + value.length;
	}

	return indices;
}

/**
 * Calculates an annotation if the given mark is applicable to the content of a block.
 *
 * @param {string} content             The content of the block.
 * @param {Mark}   mark                The mark to apply to the content.
 * @param {string} block               The block ID to apply the mark to.
 * @param {string} multilineTag        The tag the block uses to signify multiple parts.
 * @param {string} multilineWrapperTag The tag the block uses as a container.
 *
 * @returns {Array} The annotations to apply.
 */
function calculateAnnotationsForTextFormat( content, mark, block, multilineTag = false, multilineWrapperTag = false ) {
	// Create a rich text record, because those are easier to work with.
	const record = create( { html: content, multilineTag, multilineWrapperTag } );
	const { text } = record;

	let original = stripHTMLTags( mark.getOriginal() );
	/*
	 * A sentence can occur multiple times in a text, therefore we calculate all indices where
	 * the sentence occurs. We then calculate the marker offets for a single sentence and offset
	 * them with each sentence index.
	 */
	const sentenceIndices = getIndicesOf( text, original );

	if ( sentenceIndices.length === 0 ) {
		return [];
	}

	let firstSentenceIndex = sentenceIndices[ 0 ];

	/*
	 * Try again with a different HTML tag strip tactic.
	 *
	 * The rich text format in Gutenberg has no HTML at all while our marks might have some HTML.
	 * So we try to find a mark index based on the mark content with all tags stripped. In the
	 * above stripHTMLTags, HTML tags are replaced by a space. We try again by replacing HTML
	 * tags by nothing.
	 */
	if ( firstSentenceIndex === -1 ) {
		original = mark.getOriginal().replace( /(<([^>]+)>)/ig, "" );
		firstSentenceIndex = text.indexOf( original );
	}

	// If we haven't found anything at this point, we bail.
	if ( firstSentenceIndex === -1 ) {
		return null;
	}

	/*
	 * Calculate the mark offsets within the sentence the current mark targets.
	 */
	const offsets = getOffsets( mark );

	const blockOffsets = [];

	/*
	 * The offsets array holds all start- and endtag offsets for a single sentence. We now need
	 * to apply all sentence offsets to each offset to properly map them to the blocks content.
	 */
	offsets.forEach( ( startEndOffset ) => {
		sentenceIndices.forEach( sentenceIndex => {
			/*
			 * The offsets.startOffset and offsets.endOffset are offsets of the <yoastmark> relative to the
			 * start of the Mark object. The foundIndex is the index form the start of the RichText until
			 * the matched Mark, so to calculate the offset from the RichText to the <yoastmark> we need
			 * to add those offsets.
			 */
			const startOffset = sentenceIndex + startEndOffset.startOffset;
			let endOffset = sentenceIndex + startEndOffset.endOffset;

			/*
			 * If the marks are at the beginning and the end we can use the length, which gives more
			 * consistent results given we strip HTML tags.
			 */
			if ( startEndOffset.startOffset === 0 && startEndOffset.endOffset === mark.getOriginal().length ) {
				endOffset = sentenceIndex + original.length;
			}

			blockOffsets.push( {
				block: block.clientId,
				startOffset,
				endOffset,
			} );
		} );
	} );

	return blockOffsets;
}

/**
 * Returns an array of all the attributes of which we can annotate text for, for a specific block type name.
 *
 * @param {string} blockTypeName The name of the block type.
 * @returns {string[]} The attributes that we can annotate.
 */
function getAnnotatableAttributes( blockTypeName ) {
	if ( ! ANNOTATION_ATTRIBUTES.hasOwnProperty( blockTypeName ) ) {
		return [];
	}

	return ANNOTATION_ATTRIBUTES[ blockTypeName ];
}

/**
 * Returns annotations that should be applied to the given attribute.
 *
 * @param {Object} attribute The attribute to apply annotations to.
 * @param {Object} block     The block information in the state.
 * @param {Array}  marks     The marks to turn into annotations.
 *
 * @returns {Array} The annotations to apply.
 */
function getAnnotationsForBlockAttribute( attribute, block, marks ) {
	const attributeKey = attribute.key;

	const { attributes } = block;
	const attributeValue = attributes[ attributeKey ];

	// For each mark see if it applies to this block.
	return flatMap( marks, ( ( mark ) => {
		const annotations = calculateAnnotationsForTextFormat(
			attributeValue,
			mark,
			block,
			attribute.multilineTag,
			attribute.multilineWrapperTag,
		);

		if ( ! annotations ) {
			return [];
		}

		return annotations.map( annotation => {
			return {
				...annotation,
				richTextIdentifier: attributeKey,
			};
		} );
	} ) );
}

/**
 * Removes all annotations from the editor.
 *
 * @returns {void}
 */
function removeAllAnnotations() {
	annotationQueue = [];
	dispatch( "core/annotations" ).__experimentalRemoveAnnotationsBySource( ANNOTATION_SOURCE );
}

/**
 * Applies the given marks as annotations in the block editor.
 *
 * @param {Paper} paper The paper that the marks are calculated for.
 * @param {Mark[]} marks The marks to annotate in the text.
 *
 * @returns {void}
 */
export function applyAsAnnotations( paper, marks ) {
	// Do this always to allow people to select a different eye marker while another one is active.
	removeAllAnnotations();

	if ( marks.length === 0 ) {
		return;
	}

	const blocks = select( "core/editor" ).getBlocks();

	// For every block...
	const annotations = flatMap( blocks, ( ( block ) => {
		// We go through every annotatable attribute.
		return flatMap(
			getAnnotatableAttributes( block.name ),
			( ( attribute ) => getAnnotationsForBlockAttribute( attribute, block, marks ) )
		);
	} ) );

	annotationQueue = annotations.map( ( annotation ) => ( {
		blockClientId: annotation.block,
		source: ANNOTATION_SOURCE,
		richTextIdentifier: annotation.richTextIdentifier,
		range: {
			start: annotation.startOffset,
			end: annotation.endOffset,
		},
	} ) );
	scheduleAnnotationQueueApplication();
}
