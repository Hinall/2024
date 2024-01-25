CREATE OR REPLACE FUNCTION update_json_data(json_data json, p_survey_id BIGINT)
RETURNS VOID AS $$
BEGIN
   UPDATE sample3 
   SET 
      ward_id = (json_data->>'ward_id')::INTEGER, 
      property_type = (json_data->>'property_type')::text, 
      property_address = (json_data->>'property_address')::text,
      longitude = (json_data->>'longitude')::double precision,
      latitude = (json_data->>'latitude')::double precision 
   WHERE survey_id = p_survey_id;
END;
$$ LANGUAGE plpgsql;
DROP FUNCTION update_json_data(json,bigint)
SELECT update_json_data('{
    "ward_id": 8,
    "property_type": "individual",
    "property_address": "rajkot5",
    "longitude": 70.792025,
    "latitude": 22.2877586
}', 307826);
	select * from sample3 where survey_id=307826