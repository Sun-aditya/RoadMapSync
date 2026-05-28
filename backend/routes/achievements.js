const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function normalizeAchievementRow(row) {
  const themeJson = row.theme_json
    ? typeof row.theme_json === 'string'
      ? JSON.parse(row.theme_json)
      : row.theme_json
    : null;

  return {
    id: row.client_achievement_id,
    title: row.title,
    trackId: row.track_id,
    trackTitle: row.track_title,
    capstoneProject: row.capstone_project,
    completedAt: row.completed_at,
    badgeLabel: row.badge_label,
    motionSignature: row.motion_signature,
    trackTheme: themeJson,
  };
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.query(
      `SELECT client_achievement_id, title, track_id, track_title, capstone_project, badge_label,
              motion_signature, completed_at, theme_json
       FROM achievements
       WHERE user_id = ?
       ORDER BY completed_at DESC, id DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      achievements: rows.map(normalizeAchievementRow),
    });
  } catch (error) {
    console.error('List achievements error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load achievements.',
    });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      id,
      title,
      trackId,
      trackTitle,
      capstoneProject,
      completedAt,
      badgeLabel,
      motionSignature,
      trackTheme,
    } = req.body;

    if (!id || !title || !trackId || !trackTitle || !capstoneProject || !completedAt || !badgeLabel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required achievement fields.',
      });
    }

    const completedDate = new Date(completedAt);
    if (Number.isNaN(completedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'completedAt must be a valid date.',
      });
    }

    await pool.query(
      `INSERT INTO achievements
        (user_id, client_achievement_id, title, track_id, track_title, capstone_project,
         badge_label, motion_signature, completed_at, theme_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         track_title = VALUES(track_title),
         capstone_project = VALUES(capstone_project),
         badge_label = VALUES(badge_label),
         motion_signature = VALUES(motion_signature),
         completed_at = VALUES(completed_at),
         theme_json = VALUES(theme_json)`,
      [
        userId,
        String(id),
        String(title),
        String(trackId),
        String(trackTitle),
        String(capstoneProject),
        String(badgeLabel),
        motionSignature ? String(motionSignature) : null,
        completedDate,
        trackTheme ? JSON.stringify(trackTheme) : null,
      ]
    );

    const [rows] = await pool.query(
      `SELECT client_achievement_id, title, track_id, track_title, capstone_project, badge_label,
              motion_signature, completed_at, theme_json
       FROM achievements
       WHERE user_id = ? AND client_achievement_id = ?
       LIMIT 1`,
      [userId, String(id)]
    );

    return res.status(200).json({
      success: true,
      achievement: rows[0] ? normalizeAchievementRow(rows[0]) : null,
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save achievement.',
    });
  }
});

module.exports = router;