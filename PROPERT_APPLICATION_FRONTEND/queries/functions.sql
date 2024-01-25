-- FUNCTION: public.get_property_data_by_id(integer)

-- DROP FUNCTION IF EXISTS public.get_property_data_by_id(integer);

CREATE OR REPLACE FUNCTION public.get_property_data_by_id(
	p_survey_id integer)
    RETURNS TABLE(ward_id integer, property_type character varying, property_address character varying, latitude numeric, longitude numeric) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        
        ps.ward_id,
        ps.property_type::VARCHAR,
        ps.property_address::VARCHAR,
        ps.latitude::DECIMAL,
        ps.longitude::DECIMAL
    FROM
        sample3 ps
 
    WHERE
        ps.survey_id = p_survey_id;
END;
$BODY$;

ALTER FUNCTION public.get_property_data_by_id(integer)
    OWNER TO postgres;
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
        ps.latitude::DECIMAL,  -- Adjusted to DECIMAL
        ps.longitude::DECIMAL  -- Adjusted to DECIMAL
    FROM
        sample3 ps;
   
END;
$BODY$;

ALTER FUNCTION public.get_property_data()
    OWNER TO postgres;
-- FUNCTION: public.get_property_type()

-- DROP FUNCTION IF EXISTS public.get_property_type();

CREATE OR REPLACE FUNCTION public.get_property_type(
	)
    RETURNS TABLE(prop_type character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT property_type FROM lovs_property_type_master;
END;
$BODY$;

ALTER FUNCTION public.get_property_type()
    OWNER TO postgres;
