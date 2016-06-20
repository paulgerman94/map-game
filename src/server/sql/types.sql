DROP TYPE IF EXISTS element;
DROP TYPE IF EXISTS poi;
/* An element is supposed to be an OSM primitive */
CREATE TYPE element AS ENUM (
	'node',
	'way',
	'area',
	'relation'
);
/*
* POIs are uniquely defined by their ID and their element type.
* Note that the coordinate isn't contained, since it doesn't identify the POI in any way.
*/
CREATE TYPE poi AS (
	"id" BIGINT,
	"element" element
);
CREATE OR REPLACE FUNCTION poi (
	BIGINT,
	element
) RETURNS poi AS $$
	SELECT CAST(ROW($1, $2) AS poi);
$$ LANGUAGE 'sql' IMMUTABLE STRICT;