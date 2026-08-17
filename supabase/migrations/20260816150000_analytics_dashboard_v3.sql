-- Dashboard v3: date ranges, daily series, map-ready country data
-- Run in SQL Editor for project cdefpaqavekrwlqrjthg

DROP FUNCTION IF EXISTS public.analytics_dashboard(text, timestamptz);

CREATE OR REPLACE FUNCTION public.analytics_dashboard(
  p_token text,
  p_since timestamptz,
  p_until timestamptz DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  range_end timestamptz := COALESCE(p_until, now() + interval '1 second');
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);

  WITH sess AS (
    SELECT *
    FROM sessions
    WHERE started_at >= p_since
      AND started_at < range_end
  ),
  visitor_session_counts AS (
    SELECT visitor_id, count(*)::int AS n
    FROM sess
    GROUP BY visitor_id
  ),
  section_rows AS (
    SELECT COALESCE(e.props->>'section', '(unknown)') AS name, count(*)::int AS count
    FROM events e
    WHERE e.ts >= p_since
      AND e.ts < range_end
      AND e.type = 'section_view'
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 20
  ),
  click_rows AS (
    SELECT COALESCE(NULLIF(e.props->>'target', ''), '(unlabeled)') AS name, count(*)::int AS count
    FROM events e
    WHERE e.ts >= p_since
      AND e.ts < range_end
      AND e.type = 'click'
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 25
  ),
  country_rows AS (
    SELECT
      COALESCE(NULLIF(upper(country), ''), '(unknown)') AS name,
      count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 50
  ),
  city_rows AS (
    SELECT
      CASE
        WHEN city IS NOT NULL AND country IS NOT NULL THEN city || ', ' || upper(country)
        WHEN city IS NOT NULL THEN city
        WHEN country IS NOT NULL THEN upper(country)
        ELSE '(unknown)'
      END AS name,
      count(*)::int AS count
    FROM sess
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 20
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
  daily_rows AS (
    SELECT
      to_char((started_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day,
      count(*)::int AS sessions,
      count(DISTINCT visitor_id)::int AS visitors
    FROM sess
    GROUP BY 1
    ORDER BY 1
  )
  SELECT jsonb_build_object(
    'visitors', (SELECT count(DISTINCT visitor_id) FROM sess),
    'sessions', (SELECT count(*) FROM sess),
    'pageviews', (
      SELECT count(*) FROM events e
      WHERE e.ts >= p_since
        AND e.ts < range_end
        AND e.type = 'pageview'
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
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'sessions', sessions, 'visitors', visitors) ORDER BY day)
      FROM daily_rows
    ), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_dashboard(text, timestamptz, timestamptz) TO anon, authenticated, service_role;
