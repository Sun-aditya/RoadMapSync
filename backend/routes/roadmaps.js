const express = require('express');
const pool = require('../db');

const router = express.Router();

function parseJsonValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function buildRoadmapPayload(roadmapRow, nodeRows) {
  const majorMilestones = nodeRows.filter((node) => node.is_major_milestone === 1);
  const childNodesByParent = new Map();

  for (const node of nodeRows.filter((node) => node.is_major_milestone === 0)) {
    const parentId = String(node.parent_node_id);
    if (!childNodesByParent.has(parentId)) {
      childNodesByParent.set(parentId, []);
    }

    childNodesByParent.get(parentId).push(node);
  }

  const milestones = majorMilestones
    .sort((a, b) => a.node_order - b.node_order)
    .map((node) => ({
      id: node.node_key,
      title: node.title,
      description: node.description,
      microSteps: (childNodesByParent.get(String(node.id)) || [])
        .sort((a, b) => a.node_order - b.node_order)
        .map((child) => child.title),
      capstoneProject: node.capstone_project,
    }));

  return {
    id: roadmapRow.slug,
    title: roadmapRow.title,
    summary: roadmapRow.description,
    theme: parseJsonValue(roadmapRow.theme_json),
    milestones,
  };
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.slug, r.title, r.description, r.theme_json,
              COUNT(CASE WHEN n.is_major_milestone = 1 THEN 1 END) AS milestone_count,
              COUNT(n.id) AS node_count
       FROM roadmaps r
       LEFT JOIN roadmap_nodes n ON n.roadmap_id = r.id
       GROUP BY r.id, r.slug, r.title, r.description, r.theme_json
       ORDER BY r.slug ASC`
    );

    return res.status(200).json({
      success: true,
      roadmaps: rows.map((row) => ({
        id: row.slug,
        title: row.title,
        summary: row.description,
        theme: parseJsonValue(row.theme_json),
        milestoneCount: Number(row.milestone_count || 0),
        nodeCount: Number(row.node_count || 0),
      })),
    });
  } catch (error) {
    console.error('List roadmaps error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load roadmaps.',
    });
  }
});

router.get('/:roadmapId', async (req, res) => {
  try {
    const roadmapId = String(req.params.roadmapId);

    const [roadmapRows] = await pool.query(
      `SELECT id, slug, title, description, theme_json
       FROM roadmaps
       WHERE slug = ?
       LIMIT 1`,
      [roadmapId]
    );

    if (!roadmapRows.length) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found.',
      });
    }

    const roadmapRow = roadmapRows[0];
    const [nodeRows] = await pool.query(
      `SELECT id, roadmap_id, parent_node_id, node_key, title, description, node_type,
              difficulty, node_order, estimated_minutes, points, is_major_milestone,
              required_for_completion, capstone_project
       FROM roadmap_nodes
       WHERE roadmap_id = ?
       ORDER BY node_order ASC, id ASC`,
      [roadmapRow.id]
    );

    return res.status(200).json({
      success: true,
      roadmap: buildRoadmapPayload(roadmapRow, nodeRows),
    });
  } catch (error) {
    console.error('Load roadmap error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load roadmap.',
    });
  }
});

module.exports = router;