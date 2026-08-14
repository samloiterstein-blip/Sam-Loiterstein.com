-- Site analytics schema for project sam-site-analytics
-- Applied remotely via MCP; kept in-repo for reference.
-- Access model: RLS enabled, no anon/authenticated policies. Service role only.

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

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replay_chunks ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.visitors FROM anon, authenticated;
REVOKE ALL ON public.sessions FROM anon, authenticated;
REVOKE ALL ON public.events FROM anon, authenticated;
REVOKE ALL ON public.clicks FROM anon, authenticated;
REVOKE ALL ON public.replay_chunks FROM anon, authenticated;

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
