import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export async function listRoadmaps() {
  const { data } = await api.get('/roadmaps');
  return Array.isArray(data?.roadmaps) ? data.roadmaps : [];
}

export async function getRoadmap(roadmapId) {
  const { data } = await api.get(`/roadmaps/${roadmapId}`);
  return data?.roadmap || null;
}
