select * from property_master limit 10
 select * from public.tbl_property_image_master limit 10
select * from public.lovs_survey_status
create table sample4 AS
SELECT pm.survey_id,
		pm.ward_id,
	   lptm.property_type,
	   pm.property_address,
	   pm.latitude,
	   pm.longitude,
	   lpim.property_image,
	   pm.total_floors,
	   lss.value as status_value
	   
from
property_master as pm
join lovs_survey_status lss on lss.survey_status_id = pm.survey_status_id
join lovs_property_type_master lptm on lptm.property_type_id = pm.property_type_id
join tbl_property_image_master lpim on lpim.survey_id = pm.survey_id

limit 10
select * from sample4 limit 100

select property_image from sample4 where survey_id=316846