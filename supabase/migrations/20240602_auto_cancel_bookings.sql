-- Enable pg_cron extension
-- Note: You might need to enable this via the Supabase Dashboard -> Database -> Extensions first
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the function to cancel expired bookings
CREATE OR REPLACE FUNCTION cancel_expired_bookings()
RETURNS void AS $$
BEGIN
  -- Update bookings that have been pending for more than 15 minutes
  UPDATE public.bookings
  SET status = 'cancelled'
  WHERE status = 'pending_payment'
    AND created_at < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- Schedule the job to run every minute
-- Note: 'cancel-expired-bookings-job' is a unique name for the cron job
SELECT cron.schedule(
  'cancel-expired-bookings-job', -- Job Name
  '* * * * *',                   -- Cron Schedule: Every minute
  $$SELECT cancel_expired_bookings();$$
);

-- Note: To view active cron jobs, you can run: 
-- SELECT * FROM cron.job;
-- To unschedule a job: 
-- SELECT cron.unschedule('cancel-expired-bookings-job');
