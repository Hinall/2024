-- FUNCTION: public.insert_json_data(json)

-- DROP FUNCTION IF EXISTS public.insert_json_data(json);

CREATE OR REPLACE FUNCTION public.insert_json_data(
	json_data json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO sample3 (survey_id,ward_id, property_type, property_address, longitude, latitude)
    VALUES (
		(json_data->>'survey_id')::bigint,
        (json_data->>'ward_id')::INTEGER,
        (json_data->>'property_type')::text,
        json_data->>'property_address'::text,
        (json_data->>'longitude')::double precision,
        (json_data->>'latitude')::double precision
    );
END;
$BODY$;

ALTER FUNCTION public.insert_json_data(json)
    OWNER TO postgres;
select 