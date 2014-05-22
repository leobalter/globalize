define([
	"cldr",
	"globalize/number/parse",
	"json!fixtures/cldr/main/ar/numbers.json",
	"json!fixtures/cldr/main/en/numbers.json",
	"json!fixtures/cldr/main/es/numbers.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json"
], function( Cldr, parse, arNumbers, enNumbers, esNumbers, likelySubtags ) {

var ar, en, es;

Cldr.load( arNumbers );
Cldr.load( enNumbers );
Cldr.load( esNumbers );
Cldr.load( likelySubtags );

ar = new Cldr( "ar" );
en = new Cldr( "en" );
es = new Cldr( "es" );

module( "Number Parse" );

/**
 *  Integers
 */

test( "should parse integers", function() {
	equal( parse( "3", "0", en ), 3 );
});

test( "should parse zero-padded integers", function() {
	equal( parse( "003", "000", en ), 3 );
});

test( "should parse grouping separators", function() {
	equal( parse( "12,735", "#,##0.#", en ), 12735 );
	equal( parse( "1,2,7,35", "#,#,#0.#", en ), 12735 );
	equal( parse( "12.735", "#,##0", es ), 12735 );
});

test( "should parse negative integers", function() {
	equal( parse( "-3", "0", en ), -3 );
	equal( parse( "(3)", "0;(0)", en ), -3 );
});

/**
 *  Decimals
 */

test( "should parse decimals", function() {
	equal( parse( "3.14", "0.##", en ), 3.14 );
	equal( parse( "3,14", "0.##", es ), 3.14 );
	equal( parse( "3٫14", "0.##", ar ), 3.14 );
	equal( parse( "3.00", "0.##", en ), 3 );
});

test( "should parse zero-padded decimals", function() {
	equal( parse( "12735.0", "0.0", en ), 12735 );
	equal( parse( "0.10", "0.00", en ), 0.1 );
});

test( "should parse negative decimal", function() {
	equal( parse( "-3.14", "0.##", en ), -3.14 );
	equal( parse( "(3.14)", "0.##;(0.##)", en ), -3.14 );
});

/**
 *  Percent
 */

test( "should parse percent", function() {
	equal( parse( "1%", "0%", en ), 0.01 );
	equal( parse( "01%", "00%", en ), 0.01 );
	equal( parse( "10%", "0%", en ), 0.1 );
	equal( parse( "50%", "#0%", en ), 0.5 );
	equal( parse( "100%", "0%", en ), 1 );
	equal( parse( "0.5%", "##0.#%", en ), 0.005 );
	equal( parse( "0.5%", "##0.#%", en ), 0.005 );
});

test( "should localize percent symbol (%)", function() {
	equal( parse( "50٪", "#0%", ar ), 0.5 );
});

test( "should parse negative percentage", function() {
	equal( parse( "-10%", "0%", en ), -0.1 );
	equal( parse( "(10%)", "0%;(0%)", en ), -0.1 );
	equal( parse( "(10)%", "0%;(0)%", en ), -0.1 );
});

/**
 *  Per mille
 */

test( "should parse per mille", function() {
	equal( parse( "1\u2030", "0\u2030", en ), 0.001 );
	equal( parse( "01\u2030", "00\u2030", en ), 0.001 );
	equal( parse( "10\u2030", "0\u2030", en ), 0.01 );
	equal( parse( "100\u2030", "0\u2030", en ), 0.1 );
	equal( parse( "500\u2030", "#0\u2030", en ), 0.5 );
	equal( parse( "1000\u2030", "0\u2030", en ), 1 );
	equal( parse( "0.5\u2030", "##0.#\u2030", en ), 0.0005 );
	equal( parse( "0.5\u2030", "##0.#\u2030", en ), 0.0005 );
	equal( parse( "500\u2030", "#0‰", en ), 0.5 );
	equal( parse( "500‰", "#0‰", en ), 0.5 );
	equal( parse( "500؉", "#0\u2030", ar ), 0.5 );
});

test( "should parse negative mille", function() {
	equal( parse( "-1\u2030", "0\u2030", en ), -0.001 );
	equal( parse( "(1\u2030)", "0\u2030;(0\u2030)", en ), -0.001 );
	equal( parse( "(1)\u2030", "0\u2030;(0)\u2030", en ), -0.001 );
});

});
