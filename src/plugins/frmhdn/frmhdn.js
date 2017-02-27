/**
 * @title WET-BOEW Form validation
 * @overview Provide ability for a form to be broken into toggle elements.
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author @kodecount
 */
( function( $, window, document, wb ) {
"use strict";

/*
 * Variable and function definitions.
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var componentName = "wb-frmhdn",
	selector = "." + componentName,
	initEvent = "wb-init" + selector,
	$document = wb.doc,
	idCount = 0,

	/**
	 * @method init
	 * @param {jQuery Event} event Event that triggered the function call
	 */
	init = function( event ) {

		// Start initialization
		// returns DOM object = proceed with init
		// returns undefined = do not proceed with init (e.g., already initialized)
		var eventTarget = wb.init( event, componentName, selector ),
			elmId;

		if ( eventTarget ) {
			elmId = eventTarget.id;

			// Ensure there is a unique id on the element
			if ( !elmId ) {
				elmId = componentName + "-id-" + idCount;
				idCount += 1;
				eventTarget.id = elmId;
			}

			/*
			 * Variable and function definitions
			 * These well be initialized once per instance of plugin.
			 */
			var form = eventTarget.getElementsByTagName( "FORM" )[ 0 ],
				fieldsets = ( form ) ? $( form ).children( "fieldset" ) : 0;
			setSubmitEvent( form );

			/*
			 * Determines if html is correctly formatted and initialize all fieldsets/legend combitions into toggle elements.
			 */
			for ( var i = 0, len = fieldsets.length; i < len; i++ ) {

				/*
				 * Variable and function definitions
				 * These well be initialized once per instance of each fieldset.
				 */
				var fieldset = fieldsets[ i ],
					isFirstFieldset = ( i === 0 ) ? true : false,
					legend = fieldset.firstElementChild,
					div = ( legend && legend.tagName.toUpperCase() === "LEGEND" ) ? legend.nextElementSibling : false;

				if ( div && div.tagName.toUpperCase() === "DIV" ) {

					fieldset.className = "fieldset-toggle";

					legend.id = "lgnd-tggle-" + idCount;
					legend.tabIndex = "0";
					idCount += 1;
					setToggleEvent( legend );

					div.className = "hidden";
					if ( isFirstFieldset ) {
						legend.className = "toggle-open";
						div.className = "";
					}
				}
			}
		}
	},

	/**
	 * @method setSubmitEvent
	 * @param {JavaScript element} form
	 */
	setSubmitEvent = function( form ) {
		form.addEventListener( "submit", function( e ) {

			var fieldsets = ( this ) ? $( this ).children( "fieldset" ) : [];
			for ( var i = 0, len = fieldsets.length; i < len; i++ ) {
				var legend = fieldsets[ i ].firstElementChild,
					div = ( legend && legend.tagName.toUpperCase() === "LEGEND" ) ? legend.nextElementSibling : false;
				if ( div && div.tagName.toUpperCase() === "DIV" && div.className && div.className.toUpperCase().indexOf( "HIDDEN" ) > -1 ) {
					div.className = "wb-inv";
				}
			}

			if ( !$( this ).valid() ) {
				e.preventDefault();
			}

		} );
	},

	/**
	 * @method setToggleEvent
	 * @param {JavaScript element} legend
	 */
	setToggleEvent = function( legend ) {
		legend.addEventListener( "click", function( e ) {
			e.preventDefault();
			toggleFieldset( this );
		} );
		legend.addEventListener( "keydown", function( e ) {
			var key = "which" in e ? e.which : e.keyCode;
			if ( key && ( key === 13 || key === 32 ) ) {
				toggleFieldset( this );
			}
		} );
	},

	/**
	 * @method toggleFieldset
	 * @param {JavaScript element} legend
	 */
	toggleFieldset = function( legend ) {
		var div = ( legend && legend.nextElementSibling ) ? legend.nextElementSibling : false,
			isHidden = ( div && div.className && ( div.className.toUpperCase().indexOf( "HIDDEN" ) > -1 || div.className.toUpperCase().indexOf( "WB-INV" ) > -1 ) ) ? true : false;

		if ( isHidden ) {
			legend.className = "toggle-open";
			div.className = "";
		} else if ( !isHidden && div ) {
			legend.className = "";
			div.className = "hidden";
		}
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb " + initEvent, selector, init );

// Add the timer poke to initialize the plugin
wb.add( selector );

} )( jQuery, window, document, wb );
