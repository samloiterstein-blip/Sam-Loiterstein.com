-- Dashboard v2: geo on sessions + one-shot summary RPC
-- Run in SQL Editor for project cdefpaqavekrwlqrjthg

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS city text;

CREATE INDEX IF NOT EXISTS sessions_country_idx ON public.sessions(country);

DROP FUNCTION IF EXISTS public.analytics_upsert_session(uuid, uuid, timestamptz, timestamptz, text, text, text, text, integer, boolean);

CREATE OR REPLACE FUNCTION public.analytics_upsert_session(
  p_id uuid,
  p_visitor_id uuid,
  p_started_at timestamptz,
  p_ended_at timestamptz,
  p_referrer text,
  p_landing_path text,
  p_ua_device text,
  p_ua_browser text,
  p_screen_w integer,
  p_has_replay boolean,
  p_country text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_city text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO sessions (
    id, visitor_id, started_at, ended_at, referrer, landing_path,
    ua_device, ua_browser, screen_w, has_replay, country, region, city
  ) VALUES (
    p_id, p_visitor_id, p_started_at, p_ended_at, p_referrer, p_landing_path,
    p_ua_device, p_ua_browser, p_screen_w, COALESCE(p_has_replay, false),
    p_country, p_region, p_city
  )
  ON CONFLICT (id) DO UPDATE SET
    ended_at = COALESCE(EXCLUDED.ended_at, sessions.ended_at),
    referrer = COALESCE(EXCLUDED.referrer, sessions.referrer),
    landing_path = EXCLUDED.landing_path,
    ua_device = COALESCE(EXCLUDED.ua_device, sessions.ua_device),
    ua_browser = COALESCE(EXCLUDED.ua_browser, sessions.ua_browser),
    screen_w = COALESCE(EXCLUDED.screen_w, sessions.screen_w),
    has_replay = sessions.has_replay OR COALESCE(EXCLUDED.has_replay, false),
    country = COALESCE(EXCLUDED.country, sessions.country),
    region = COALESCE(EXCLUDED.region, sessions.region),
    city = COALESCE(EXCLUDED.city, sessions.city);
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_upsert_session(
  uuid, uuid, timestamptz, timestamptz, text, text, text, text, integer, boolean, text, text, text
) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.analytics_dashboard(
  p_token text,
  p_since timestamptz
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);

  WITH sess AS (
    SELECT * FROM sessions WHERE started_at >= p_since
  ),
  visitor_session_counts AS (
    SELECT visitor_id, count(*)::int AS n
    FROM sess
    GROUP BY visitor_id
  ),
  section_rows AS (
    SELECT COALESCE(e.props->>'section', '(unknown)') AS name, count(*)::int AS count
    FROM events e
    WHERE e.ts >= p_since AND e.type = 'section_view'
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 20
  ),
  click_rows AS (
    SELECT COALESCE(NULLIF(e.props->>'target', ''), '(unlabeled)') AS name, count(*)::int AS count
    FROM events e
    WHERE e.ts >= p_since AND e.type = 'click'
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 25
  ),
  country_rows AS (
    SELECT COALESCE(NULLIF(country, ''), '(unknown)') AS name, count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 15
  ),
  city_rows AS (
    SELECT
      CASE
        WHEN city IS NOT NULL AND country IS NOT NULL THEN city || ', ' || country
        WHEN city IS NOT NULL THEN city
        WHEN country IS NOT NULL THEN country
        ELSE '(unknown)'
      END AS name,
      count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 15
  ),
  referrer_rows AS (
    SELECT
      CASE
        WHEN referrer IS NULL OR referrer = '' THEN 'direct'
        ELSE coalesce(
          substring(referrer from 'https?://([^/]+)'),
          left(referrer, 80)
        )
      END AS name,
      count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 10
  ),
  device_rows AS (
    SELECT COALESCE(NULLIF(ua_device, ''), '(unknown)') AS name, count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 10
  ),
  points AS (
    SELECT c.x_pct AS x, c.y_pct AS y, c.target
    FROM clicks c
    WHERE c.ts >= p_since
    ORDER BY c.ts DESC
    LIMIT 3000
  )
  SELECT jsonb_build_object(
    'visitors', (SELECT count(DISTINCT visitor_id) FROM sess),
    'sessions', (SELECT count(*) FROM sess),
    'pageviews', (
      SELECT count(*) FROM events e
      WHERE e.ts >= p_since AND e.type = 'pageview'
    ),
    'repeat_visitors', (
      SELECT count(*) FROM visitor_session_counts WHERE n > 1
    ),
    'new_visitors', (
      SELECT count(*) FROM visitor_session_counts WHERE n = 1
    ),
    'sections', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM section_rows), '[]'::jsonb),
    'top_clicks', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM click_rows), '[]'::jsonb),
    'countries', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM country_rows), '[]'::jsonb),
    'cities', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM city_rows), '[]'::jsonb),
    'referrers', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM referrer_rows), '[]'::jsonb),
    'devices', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM device_rows), '[]'::jsonb),
    'click_points', COALESCE((SELECT jsonb_agg(jsonb_build_object('x', x, 'y', y, 'target', target)) FROM points), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_dashboard(text, timestamptz) TO anon, authenticated, service_role;
