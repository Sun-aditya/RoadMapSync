const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function normalizeProgressRow(row) {
  const progressJson = row.progress_json
    ? typeof row.progress_json === 'string'
      ? JSON.parse(row.progress_json)
      : row.progress_json
    : null;

  return {
    roadmapId: row.roadmap_id,
    progress: progressJson,
    updatedAt: row.updated_at,
  };
}

router.get('/:roadmapId', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const roadmapId = String(req.params.roadmapId);

    const [rows] = await pool.query(
      `SELECT roadmap_id, progress_json, updated_at
       FROM roadmap_progress_snapshots
       WHERE user_id = ? AND roadmap_id = ?
       LIMIT 1`,
      [userId, roadmapId]
    );

    return res.status(200).json({
      success: true,
      progress: rows[0] ? normalizeProgressRow(rows[0]) : null,
    });
  } catch (error) {
    console.error('Load roadmap progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load roadmap progress.',
    });
  }
});

router.put('/:roadmapId', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const roadmapId = String(req.params.roadmapId);
    const { progress } = req.body;

    if (!progress || typeof progress !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Progress payload is required.',
      });
    }

    const progressJson = JSON.stringify(progress);

    await pool.query(
      `INSERT INTO roadmap_progress_snapshots (user_id, roadmap_id, progress_json)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         progress_json = VALUES(progress_json),
         updated_at = CURRENT_TIMESTAMP`,
      [userId, roadmapId, progressJson]
    );

    const [rows] = await pool.query(
      `SELECT roadmap_id, progress_json, updated_at
       FROM roadmap_progress_snapshots
       WHERE user_id = ? AND roadmap_id = ?
       LIMIT 1`,
      [userId, roadmapId]
    );

    return res.status(200).json({
      success: true,
      progress: rows[0] ? normalizeProgressRow(rows[0]) : null,
    });
  } catch (error) {
    console.error('Save roadmap progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save roadmap progress.',
    });
  }
});

module.exports = router;