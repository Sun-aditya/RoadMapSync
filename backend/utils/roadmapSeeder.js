const path = require('path');
const { pathToFileURL } = require('url');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapTrackType(roadmapId) {
  switch (roadmapId) {
    case 'web-development':
      return 'fullstack';
    case 'app-development':
      return 'mobile';
    case 'devops':
      return 'cloud_devops';
    case 'cybersecurity':
      return 'other';
    default:
      return 'other';
  }
}

async function loadRoadmapDefinitions() {
  const sourcePath = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'data', 'roadmapsData.js');
  const importedModule = await import(pathToFileURL(sourcePath).href);
  return importedModule.roadmapsData || [];
}

async function ensureRoadmapSchema(pool) {
  await pool.query(`ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS theme_json JSON NULL`);
  await pool.query(`ALTER TABLE roadmap_nodes ADD COLUMN IF NOT EXISTS capstone_project TEXT NULL`);
}

async function seedRoadmaps(pool) {
  const definitions = await loadRoadmapDefinitions();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const roadmap of definitions) {
      await connection.query(
        `INSERT INTO roadmaps (slug, title, description, track_type, is_public, version, theme_json)
         VALUES (?, ?, ?, ?, 1, '1.0', ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           track_type = VALUES(track_type),
           is_public = VALUES(is_public),
           version = VALUES(version),
           theme_json = VALUES(theme_json)`,
        [
          roadmap.id,
          roadmap.title,
          roadmap.summary,
          mapTrackType(roadmap.id),
          JSON.stringify(roadmap.theme || {}),
        ]
      );

      const [roadmapRows] = await connection.query('SELECT id FROM roadmaps WHERE slug = ? LIMIT 1', [roadmap.id]);
      const roadmapId = roadmapRows[0].id;

      for (let milestoneIndex = 0; milestoneIndex < roadmap.milestones.length; milestoneIndex += 1) {
        const milestone = roadmap.milestones[milestoneIndex];
        const milestoneKey = milestone.id || `${roadmap.id}-milestone-${milestoneIndex + 1}`;
        const milestoneOrder = (milestoneIndex + 1) * 100;

        await connection.query(
          `INSERT INTO roadmap_nodes
            (roadmap_id, parent_node_id, node_key, title, description, node_type, difficulty, node_order,
             estimated_minutes, points, is_major_milestone, required_for_completion, capstone_project)
           VALUES (?, NULL, ?, ?, ?, 'milestone', 'intermediate', ?, NULL, 100, 1, 1, ?)
           ON DUPLICATE KEY UPDATE
             title = VALUES(title),
             description = VALUES(description),
             node_type = VALUES(node_type),
             difficulty = VALUES(difficulty),
             node_order = VALUES(node_order),
             estimated_minutes = VALUES(estimated_minutes),
             points = VALUES(points),
             is_major_milestone = VALUES(is_major_milestone),
             required_for_completion = VALUES(required_for_completion),
             capstone_project = VALUES(capstone_project)`,
          [roadmapId, milestoneKey, milestone.title, milestone.description, milestoneOrder, milestone.capstoneProject]
        );

        const [milestoneRows] = await connection.query(
          'SELECT id FROM roadmap_nodes WHERE roadmap_id = ? AND node_key = ? LIMIT 1',
          [roadmapId, milestoneKey]
        );
        const milestoneNodeId = milestoneRows[0].id;

        for (let stepIndex = 0; stepIndex < milestone.microSteps.length; stepIndex += 1) {
          const stepTitle = milestone.microSteps[stepIndex];
          const stepKey = `${milestoneKey}-${slugify(stepTitle)}`;

          await connection.query(
            `INSERT INTO roadmap_nodes
              (roadmap_id, parent_node_id, node_key, title, description, node_type, difficulty, node_order,
               estimated_minutes, points, is_major_milestone, required_for_completion, capstone_project)
             VALUES (?, ?, ?, ?, NULL, 'checkpoint', 'beginner', ?, NULL, 10, 0, 1, NULL)
             ON DUPLICATE KEY UPDATE
               parent_node_id = VALUES(parent_node_id),
               title = VALUES(title),
               node_type = VALUES(node_type),
               difficulty = VALUES(difficulty),
               node_order = VALUES(node_order),
               estimated_minutes = VALUES(estimated_minutes),
               points = VALUES(points),
               is_major_milestone = VALUES(is_major_milestone),
               required_for_completion = VALUES(required_for_completion)`,
            [roadmapId, milestoneNodeId, stepKey, stepTitle, milestoneOrder + stepIndex + 1]
          );
        }
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function ensureAndSeedRoadmaps(pool) {
  await ensureRoadmapSchema(pool);
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM roadmaps');

  if (Number(rows[0]?.total || 0) === 0) {
    await seedRoadmaps(pool);
    return;
  }

  // Keep the canonical curriculum aligned even if rows already exist.
  await seedRoadmaps(pool);
}

module.exports = {
  ensureAndSeedRoadmaps,
};