with vars as (
select property_master.survey_id,public.lovs_survey_status.value as prop_status
	from public.lovs_survey_status
	join property_master 
	on property_master.survey_status_id=public.lovs_survey_status.survey_status_id
)

select json_agg(json_build_object('survey_id' , t1.survey_id)) FROM property_master as t1 limit 10  
UPDATE sample3
set property_status=(select "value" from (select property_master.survey_id,public.lovs_survey_status.value
	from public.lovs_survey_status,property_master
	where property_master.survey_status_id=public.lovs_survey_status.survey_status_id))
public.lovs_survey_status
public.property_master
public.sample3
UPDATE sample3



UPDATE sample3
SET property_status = (
    SELECT lovs_survey_status.value
    FROM public.lovs_survey_status
    JOIN property_master ON property_master.survey_status_id = lovs_survey_status.survey_status_id
    WHERE sample3.survey_id = property_master.survey_id
    LIMIT 1
);
select * from sample3 limit 100

select * from public.tbl_property_image_master limit 10

update sample3
set property_image=tbl_property_image_master.property_image
from tbl_property_image_master
where sample3.survey_id=tbl_property_image_master.survey_id