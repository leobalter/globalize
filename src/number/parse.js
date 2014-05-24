define([
	"./number-re",
	"./pattern-properties",
	"./symbol",
	"./symbol/map",
	"../util/object/keys"
], function( numberNumberRe, numberPatternProperties, numberSymbol, numberSymbolMap, objectKeys ) {

/**
 * parse( value, cldr )
 *
 * @value [String].
 *
 * @cldr [Cldr instance].
 */
return function( value, pattern, cldr ) {
	var aux, number, prefix, properties, suffix,
		symbolMap = numberSymbolMap( cldr );

	// Infinite number.
	if ( aux = value.match( numberSymbol( "∞", cldr ) ) ) {

		number = Infinity;
		prefix = value.slice( 0, aux.length );
		suffix = value.slice( aux.length + 1 );

	// Finite number.
	} else {

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

		prefix = value[ 1 ];
		suffix = value[ 6 ];

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
	}

	// Negative number
	// "If there is an explicit negative subpattern, it serves only to specify the negative prefix and suffix. If there is no explicit negative subpattern, the negative subpattern is the localized minus sign prefixed to the positive subpattern" UTS#35
	pattern = pattern.split( ";" );
	properties = numberPatternProperties( pattern[ 1 ] || pattern[ 0 ] );
	if ( prefix === ( pattern[ 1 ] ? "" : "-" ) + properties[ 0 ] && suffix === properties[ 10 ] ) {
		number *= -1;
	}

	return number;
};

});
