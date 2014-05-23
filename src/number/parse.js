define([
	"./number-re",
	"./pattern-properties",
	"./symbol/map",
	"../util/object/keys"
], function( numberNumberRe, numberPatternProperties, numberSymbolMap, objectKeys ) {

/**
 * parse( value, cldr )
 *
 * @value [String].
 *
 * @cldr [Cldr instance].
 */
return function( value, pattern, cldr ) {
	var number, properties,
		symbolMap = numberSymbolMap( cldr );

	// Reverse localized symbols.
	value = value.replace( new RegExp( "[" + objectKeys( symbolMap ).join( "]|[" ) + "]", "g" ), function( localizedSymbol ) {
		return symbolMap[ localizedSymbol ];
	});

	// Is it a valid number?
	value = value.match( numberNumberRe );
	if ( !value ) {

		// Invalid number.
		return null;
	}

	// Remove grouping separators.
	number = value[ 2 ].replace( /,/g, "" );

	// Transform String into a Number
	number = +number;

	// Is it a valid number?
	if ( isNaN( number ) ) {

		// Invalid number.
		return null;
	}

	// Percent
	if ( value[ 0 ].indexOf( "%" ) !== -1 ) {
		number /= 100;

	// Per mille
	} else if ( value[ 0 ].indexOf( "\u2030" ) !== -1 ) {
		number /= 1000;
	}

	// Negative (if number prefix and suffix match pattern's).
	// If there is an explicit negative subpattern, its negative prefix and suffix are checked.
	// If there is no explicit negative subpattern, positive prefix prefixed by a minus sign and positive suffix are checked.
	pattern = pattern.split( ";" );
	properties = numberPatternProperties( pattern[ 1 ] || pattern[ 0 ] );
	if ( value[ 1 ] === ( pattern[ 1 ] ? "" : "-" ) + properties[ 0 ] && value[ 6 ] === properties[ 10 ] ) {
		number *= -1;
	}

	return number;
};

});
