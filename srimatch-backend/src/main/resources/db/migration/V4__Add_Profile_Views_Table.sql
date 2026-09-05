CREATE TABLE profile_views (
    id BIGSERIAL PRIMARY KEY,
    viewer_id BIGINT NOT NULL,
    viewed_profile_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_viewer FOREIGN KEY (viewer_id) REFERENCES users(id),
    CONSTRAINT fk_viewed_profile FOREIGN KEY (viewed_profile_id) REFERENCES profiles(id)
);

CREATE INDEX idx_viewer_profile ON profile_views(viewer_id, viewed_profile_id);
CREATE INDEX idx_viewed_at ON profile_views(viewed_at);
