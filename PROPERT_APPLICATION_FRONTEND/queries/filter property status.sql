 SELECT "value" FROM public.lovs_survey_status 
 
 select * from sample3 where property_status = 'SURVEY DONE'
CREATE OR REPLACE FUNCTION filter_property_status(selected_property_status TEXT)
RETURNS TABLE (
    survey_id BIGINT,
    ward_id INT,
    property_type TEXT,
    property_address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    property_status TEXT,
    images TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sample3.survey_id,
        sample3.ward_id,
        sample3.property_type,
        sample3.property_address,
        sample3.latitude::DOUBLE PRECISION,
        sample3.longitude::DOUBLE PRECISION,
        sample3.property_status,
        sample3.property_image
    FROM 
        sample3
    WHERE 
        sample3.property_status = selected_property_status;
END;
$$;




SELECT * FROM filter_property_status('SURVEY DONE');
 DROP FUNCTION filter_property_status(text)
select * from sample3 limit 10