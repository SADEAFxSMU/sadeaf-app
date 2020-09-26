CREATE OR REPLACE FUNCTION insert_feedback()
RETURNS trigger as 
$$
BEGIN
    INSERT INTO public.feedback (volunteer_id, event_id)
    SELECT DISTINCT volunteer_id, event_id FROM assignment a
        WHERE 
        NOT EXISTS (SELECT * from public.feedback where a.volunteer_id = feedback.volunteer_id and a.event_id = feedback.event_id)
        AND
        NEW.event_id NOT in (
              SELECT event_id from assignment
              WHERE
                event_id = new.event_id
                AND
                status NOT LIKE 'COMPLETE' AND status NOT LIKE 'CANCELLED'
            )
        AND
          NEW.event_id = a.event_id 
        AND
          a.volunteer_id is not null; 
            
    -- VALUES (assignment.volunteer_id, assignment.event_id);
RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS UPDATE_FEEDBACK_ON_ASSIGNMENT_UPDATE_TRIGGER on "assignment";
CREATE TRIGGER UPDATE_FEEDBACK_ON_ASSIGNMENT_UPDATE_TRIGGER
    AFTER UPDATE on "assignment"
    FOR EACH ROW
    WHEN (NEW.status like 'CANCELLED' or NEW.status like 'COMPLETE') 
    EXECUTE PROCEDURE insert_feedback();
