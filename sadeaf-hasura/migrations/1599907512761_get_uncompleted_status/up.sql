---------------[COMPUTED FIELD]-----------------
CREATE OR REPLACE FUNCTION get_uncompleted_status(events_row event)
RETURNS BOOLEAN AS $$
SELECT EXISTS (
  SELECT * from assignment
  WHERE
    event_id = events_row.id
    AND
    status NOT LIKE 'COMPLETE' AND status NOT LIKE 'CANCELLED'
);
$$ LANGUAGE sql STABLE;
