-- Named tracking links + session source attribution

CREATE TABLE IF NOT EXISTS public.tracking_links (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$|^[a-z0-9]$'),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tracking_links ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tracking_links FROM anon, authenticated;

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS source_slug text;

CREATE INDEX IF NOT EXISTS sessions_source_slug_idx ON public.sessions(source_slug);

INSERT INTO public.tracking_links (slug, name) VALUES
  ('linkedin', 'LinkedIn'),
  ('email', 'Email signature'),
  ('website', 'Website')
ON CONFLICT (slug) DO NOTHING;

-- Extend session upsert (drop old signature)
DROP FUNCTION IF EXISTS public.analytics_upsert_session(uuid, uuid, timestamptz, timestamptz, text, text, text, text, integer, boolean, text, text, text);

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
  p_city text DEFAULT NULL,
  p_source_slug text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO sessions (
    id, visitor_id, started_at, ended_at, referrer, landing_path,
    ua_device, ua_browser, screen_w, has_replay, country, region, city, source_slug
  ) VALUES (
    p_id, p_visitor_id, p_started_at, p_ended_at, p_referrer, p_landing_path,
    p_ua_device, p_ua_browser, p_screen_w, COALESCE(p_has_replay, false),
    p_country, p_region, p_city, NULLIF(lower(trim(p_source_slug)), '')
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
    city = COALESCE(EXCLUDED.city, sessions.city),
    source_slug = COALESCE(EXCLUDED.source_slug, sessions.source_slug);
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_upsert_session(
  uuid, uuid, timestamptz, timestamptz, text, text, text, text, integer, boolean, text, text, text, text
) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.analytics_list_tracking_links(p_token text)
RETURNS TABLE(slug text, name text, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT tl.slug, tl.name, tl.created_at
  FROM tracking_links tl
  ORDER BY tl.name ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_create_tracking_link(
  p_token text,
  p_slug text,
  p_name text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized text := lower(trim(p_slug));
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'name required';
  END IF;
  IF normalized !~ '^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$' AND normalized !~ '^[a-z0-9]$' THEN
    RAISE EXCEPTION 'invalid slug';
  END IF;
  INSERT INTO tracking_links (slug, name)
  VALUES (normalized, trim(p_name))
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_delete_tracking_link(
  p_token text,
  p_slug text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  DELETE FROM tracking_links WHERE slug = lower(trim(p_slug));
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_list_tracking_links(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_create_tracking_link(text, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_delete_tracking_link(text, text) TO anon, authenticated, service_role;

-- Patch dashboard to include sources
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
    WHERE e.ts >= p_since AND e.ts < range_end AND e.type = 'section_view'
    GROUP BY 1 ORDER BY count DESC LIMIT 20
  ),
  click_rows AS (
    SELECT COALESCE(NULLIF(e.props->>'target', ''), '(unlabeled)') AS name, count(*)::int AS count
    FROM events e
    WHERE e.ts >= p_since AND e.ts < range_end AND e.type = 'click'
    GROUP BY 1 ORDER BY count DESC LIMIT 25
  ),
  country_rows AS (
    SELECT COALESCE(NULLIF(upper(country), ''), '(unknown)') AS name, count(*)::int AS count
    FROM sess GROUP BY 1 ORDER BY count DESC LIMIT 50
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
    FROM sess GROUP BY 1 ORDER BY count DESC LIMIT 20
  ),
  referrer_rows AS (
    SELECT
      CASE
        WHEN referrer IS NULL OR referrer = '' THEN 'direct'
        ELSE coalesce(substring(referrer from 'https?://([^/]+)'), left(referrer, 80))
      END AS name,
      count(*)::int AS count
    FROM sess GROUP BY 1 ORDER BY count DESC LIMIT 10
  ),
  device_rows AS (
    SELECT COALESCE(NULLIF(ua_device, ''), '(unknown)') AS name, count(*)::int AS count
    FROM sess GROUP BY 1 ORDER BY count DESC LIMIT 10
  ),
  daily_rows AS (
    SELECT
      to_char((started_at AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS day,
      count(*)::int AS sessions,
      count(DISTINCT visitor_id)::int AS visitors
    FROM sess GROUP BY 1 ORDER BY 1
  ),
  source_rows AS (
    SELECT
      COALESCE(tl.name, COALESCE(NULLIF(s.source_slug, ''), 'Direct / organic')) AS name,
      COALESCE(s.source_slug, '') AS slug,
      count(*)::int AS count
    FROM sess s
    LEFT JOIN tracking_links tl ON tl.slug = s.source_slug
    GROUP BY 1, 2
    ORDER BY count DESC
  )
  SELECT jsonb_build_object(
    'visitors', (SELECT count(DISTINCT visitor_id) FROM sess),
    'sessions', (SELECT count(*) FROM sess),
    'pageviews', (
      SELECT count(*) FROM events e
      WHERE e.ts >= p_since AND e.ts < range_end AND e.type = 'pageview'
    ),
    'repeat_visitors', (SELECT count(*) FROM visitor_session_counts WHERE n > 1),
    'new_visitors', (SELECT count(*) FROM visitor_session_counts WHERE n = 1),
    'sections', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM section_rows), '[]'::jsonb),
    'top_clicks', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM click_rows), '[]'::jsonb),
    'countries', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM country_rows), '[]'::jsonb),
    'cities', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM city_rows), '[]'::jsonb),
    'referrers', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM referrer_rows), '[]'::jsonb),
    'devices', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', name, 'count', count)) FROM device_rows), '[]'::jsonb),
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('day', day, 'sessions', sessions, 'visitors', visitors) ORDER BY day)
      FROM daily_rows
    ), '[]'::jsonb),
    'sources', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('name', name, 'slug', slug, 'count', count) ORDER BY count DESC)
      FROM source_rows
    ), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;
