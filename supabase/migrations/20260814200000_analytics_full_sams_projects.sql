-- Full analytics schema for https://cdefpaqavekrwlqrjthg.supabase.co
-- Run in Supabase SQL Editor (Sam's Projects pt 2)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  referrer text,
  landing_path text NOT NULL DEFAULT '/',
  ua_device text,
  ua_browser text,
  screen_w integer,
  has_replay boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON public.sessions(visitor_id);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON public.sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS sessions_has_replay_idx ON public.sessions(has_replay) WHERE has_replay = true;

CREATE TABLE IF NOT EXISTS public.events (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  ts timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('pageview', 'section_view', 'scroll_depth', 'click')),
  path text NOT NULL DEFAULT '/',
  props jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS events_session_id_idx ON public.events(session_id);
CREATE INDEX IF NOT EXISTS events_ts_idx ON public.events(ts DESC);
CREATE INDEX IF NOT EXISTS events_type_idx ON public.events(type);

CREATE TABLE IF NOT EXISTS public.clicks (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  ts timestamptz NOT NULL DEFAULT now(),
  path text NOT NULL DEFAULT '/',
  target text,
  x_pct real NOT NULL CHECK (x_pct >= 0 AND x_pct <= 100),
  y_pct real NOT NULL CHECK (y_pct >= 0 AND y_pct <= 100),
  vw integer,
  vh integer
);

CREATE INDEX IF NOT EXISTS clicks_session_id_idx ON public.clicks(session_id);
CREATE INDEX IF NOT EXISTS clicks_path_ts_idx ON public.clicks(path, ts DESC);

CREATE TABLE IF NOT EXISTS public.replay_chunks (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  seq integer NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, seq)
);

CREATE INDEX IF NOT EXISTS replay_chunks_session_id_idx ON public.replay_chunks(session_id);
CREATE INDEX IF NOT EXISTS replay_chunks_created_at_idx ON public.replay_chunks(created_at);

CREATE TABLE IF NOT EXISTS public.analytics_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO public.analytics_config(key, value)
VALUES ('read_token', '680d3314d68e22cff03f73ca0397a49a')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replay_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_config ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.visitors FROM anon, authenticated;
REVOKE ALL ON public.sessions FROM anon, authenticated;
REVOKE ALL ON public.events FROM anon, authenticated;
REVOKE ALL ON public.clicks FROM anon, authenticated;
REVOKE ALL ON public.replay_chunks FROM anon, authenticated;
REVOKE ALL ON public.analytics_config FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.cleanup_old_replay_chunks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.replay_chunks
  WHERE created_at < now() - interval '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  UPDATE public.sessions s
  SET has_replay = false
  WHERE has_replay = true
    AND NOT EXISTS (
      SELECT 1 FROM public.replay_chunks rc WHERE rc.session_id = s.id
    );

  RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_replay_chunks() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_old_replay_chunks() TO service_role;

CREATE OR REPLACE FUNCTION public.analytics_upsert_visitor(
  p_id uuid,
  p_first_seen timestamptz,
  p_last_seen timestamptz
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO visitors (id, first_seen, last_seen)
  VALUES (p_id, p_first_seen, p_last_seen)
  ON CONFLICT (id) DO UPDATE
    SET last_seen = EXCLUDED.last_seen;
END;
$$;

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
  p_has_replay boolean
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO sessions (
    id, visitor_id, started_at, ended_at, referrer, landing_path,
    ua_device, ua_browser, screen_w, has_replay
  ) VALUES (
    p_id, p_visitor_id, p_started_at, p_ended_at, p_referrer, p_landing_path,
    p_ua_device, p_ua_browser, p_screen_w, COALESCE(p_has_replay, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    ended_at = COALESCE(EXCLUDED.ended_at, sessions.ended_at),
    referrer = COALESCE(EXCLUDED.referrer, sessions.referrer),
    landing_path = EXCLUDED.landing_path,
    ua_device = COALESCE(EXCLUDED.ua_device, sessions.ua_device),
    ua_browser = COALESCE(EXCLUDED.ua_browser, sessions.ua_browser),
    screen_w = COALESCE(EXCLUDED.screen_w, sessions.screen_w),
    has_replay = sessions.has_replay OR COALESCE(EXCLUDED.has_replay, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_insert_events(p_rows jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO events (session_id, ts, type, path, props)
  SELECT
    (r->>'session_id')::uuid,
    COALESCE((r->>'ts')::timestamptz, now()),
    r->>'type',
    COALESCE(r->>'path', '/'),
    COALESCE(r->'props', '{}'::jsonb)
  FROM jsonb_array_elements(p_rows) AS r;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_insert_clicks(p_rows jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO clicks (session_id, ts, path, target, x_pct, y_pct, vw, vh)
  SELECT
    (r->>'session_id')::uuid,
    COALESCE((r->>'ts')::timestamptz, now()),
    COALESCE(r->>'path', '/'),
    r->>'target',
    (r->>'x_pct')::real,
    (r->>'y_pct')::real,
    NULLIF(r->>'vw', '')::integer,
    NULLIF(r->>'vh', '')::integer
  FROM jsonb_array_elements(p_rows) AS r;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_insert_replay_chunk(
  p_session_id uuid,
  p_seq integer,
  p_payload jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO replay_chunks (session_id, seq, payload)
  VALUES (p_session_id, p_seq, p_payload)
  ON CONFLICT (session_id, seq) DO UPDATE
    SET payload = EXCLUDED.payload;

  UPDATE sessions SET has_replay = true WHERE id = p_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_session_exists(p_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM sessions WHERE id = p_id);
$$;

CREATE OR REPLACE FUNCTION public.analytics_get_session_replay_flag(p_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT has_replay FROM sessions WHERE id = p_id), false);
$$;

CREATE OR REPLACE FUNCTION public._analytics_assert_read_token(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected text;
BEGIN
  SELECT value INTO expected FROM analytics_config WHERE key = 'read_token';
  IF expected IS NULL OR p_token IS DISTINCT FROM expected THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_counts(
  p_token text,
  p_since timestamptz
) RETURNS TABLE(visitors bigint, pageviews bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM visitors v WHERE v.last_seen >= p_since),
    (SELECT count(*) FROM events e WHERE e.type = 'pageview' AND e.ts >= p_since);
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_list_sessions(
  p_token text,
  p_since timestamptz,
  p_replay_only boolean DEFAULT false,
  p_limit integer DEFAULT 100
) RETURNS SETOF sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT *
  FROM sessions s
  WHERE s.started_at >= p_since
    AND (NOT p_replay_only OR s.has_replay = true)
  ORDER BY s.started_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 200);
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_list_events(
  p_token text,
  p_since timestamptz,
  p_types text[],
  p_limit integer DEFAULT 5000
) RETURNS TABLE(type text, props jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT e.type, e.props
  FROM events e
  WHERE e.ts >= p_since
    AND e.type = ANY(p_types)
  ORDER BY e.ts DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 5000);
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_list_clicks(
  p_token text,
  p_since timestamptz,
  p_path text DEFAULT NULL,
  p_limit integer DEFAULT 5000
) RETURNS TABLE(path text, x_pct real, y_pct real, target text, ts timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT c.path, c.x_pct, c.y_pct, c.target, c.ts
  FROM clicks c
  WHERE c.ts >= p_since
    AND (p_path IS NULL OR c.path = p_path)
  ORDER BY c.ts DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 5000);
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_list_replay_chunks(
  p_token text,
  p_session_id uuid
) RETURNS TABLE(seq integer, payload jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public._analytics_assert_read_token(p_token);
  RETURN QUERY
  SELECT rc.seq, rc.payload
  FROM replay_chunks rc
  WHERE rc.session_id = p_session_id
  ORDER BY rc.seq ASC;
END;
$$;

REVOKE ALL ON FUNCTION public._analytics_assert_read_token(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.analytics_upsert_visitor(uuid, timestamptz, timestamptz) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_upsert_session(uuid, uuid, timestamptz, timestamptz, text, text, text, text, integer, boolean) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_insert_events(jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_insert_clicks(jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_insert_replay_chunk(uuid, integer, jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_session_exists(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_get_session_replay_flag(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_counts(text, timestamptz) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_list_sessions(text, timestamptz, boolean, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_list_events(text, timestamptz, text[], integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_list_clicks(text, timestamptz, text, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.analytics_list_replay_chunks(text, uuid) TO anon, authenticated, service_role;
