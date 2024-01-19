-- FUNCTION: public.get_property_data()

-- DROP FUNCTION IF EXISTS public.get_property_data();

CREATE OR REPLACE FUNCTION public.get_property_data(
	)
    RETURNS TABLE(survey_id bigint, ward_id integer, property_type character varying, property_address character varying, latitude numeric, longitude numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
    ps.survey_id,
    ps.ward_id,
    ps.property_type::VARCHAR,
    ps.property_address::VARCHAR,
    ps.latitude::DECIMAL,
    ps.longitude::DECIMAL
FROM
    sample3 ps
WHERE
    ps.latitude IS NOT NULL AND
    ps.longitude IS NOT NULL
ORDER BY
    ps.survey_id ASC;
END;
$BODY$;

ALTER FUNCTION public.get_property_data()
    OWNER TO postgres;
