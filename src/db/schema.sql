CREATE TABLE IF NOT EXISTS urls (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(12)  NOT NULL UNIQUE,
  long_url    TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clicks (
  id         SERIAL PRIMARY KEY,
  url_id     INTEGER      NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  ip         INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_urls_code    ON urls(code);
CREATE INDEX IF NOT EXISTS idx_clicks_url_id ON clicks(url_id);