-- RPC helpers for publishable-key ingest + token-gated dashboard reads.
-- Applied to sam-site-analytics (jojekwwunwcofoixixgz). See MCP migration history.

-- Write path: analytics_upsert_visitor, analytics_upsert_session,
-- analytics_insert_events, analytics_insert_clicks, analytics_insert_replay_chunk,
-- analytics_session_exists

-- Read path (requires analytics_config.read_token):
-- analytics_counts, analytics_list_sessions, analytics_list_events,
-- analytics_list_clicks, analytics_list_replay_chunks
