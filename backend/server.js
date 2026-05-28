const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRouter = require('./routes/auth');
const achievementsRouter = require('./routes/achievements');
const roadmapProgressRouter = require('./routes/roadmapProgress');
const roadmapsRouter = require('./routes/roadmaps');
const { ensureAndSeedRoadmaps } = require('./utils/roadmapSeeder');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/roadmap-progress', roadmapProgressRouter);
app.use('/api/roadmaps', roadmapsRouter);

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok;');

    res.status(200).json({
      success: true,
      message: 'Database connection is working.',
      data: rows[0],
    });
  } catch (error) {
    console.error('Database test failed:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed.',
    });
  }
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

async function startServer() {
  try {
    await ensureAndSeedRoadmaps(pool);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        client_achievement_id VARCHAR(191) NOT NULL,
        title VARCHAR(200) NOT NULL,
        track_id VARCHAR(120) NOT NULL,
        track_title VARCHAR(160) NOT NULL,
        capstone_project TEXT NOT NULL,
        badge_label VARCHAR(180) NOT NULL,
        motion_signature VARCHAR(100) NULL,
        completed_at DATETIME NOT NULL,
        theme_json JSON NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_achievements_user_client (user_id, client_achievement_id),
        KEY idx_achievements_user_completed (user_id, completed_at),
        CONSTRAINT fk_achievements_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS roadmap_progress_snapshots (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        roadmap_id VARCHAR(120) NOT NULL,
        progress_json JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_roadmap_progress_user_roadmap (user_id, roadmap_id),
        KEY idx_roadmap_progress_user_updated (user_id, updated_at),
        CONSTRAINT fk_roadmap_progress_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
