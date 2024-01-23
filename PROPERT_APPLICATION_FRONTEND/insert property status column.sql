UPDATE sample3
SET property_status = Subquery.prop_status
FROM (
    SELECT
        property_master.survey_id,
        public.lovs_survey_status.value AS prop_status
    FROM
        public.lovs_survey_status
        JOIN property_master ON property_master.survey_status_id = public.lovs_survey_status.survey_status_id
) AS Subquery
WHERE sample3.survey_id = Subquery.survey_id;
select * from sample3 limit 100

select * from public.tbl_property_image_master limit 10

update sample3
set property_image=tbl_property_image_master.property_image
from tbl_property_image_master
where sample3.survey_id=tbl_property_image_master.survey_id