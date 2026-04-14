import type { NextApiRequest, NextApiResponse } from 'next';
import { getSkillById } from '@data/vibesuite/skills';
import { UserProgress } from '@local-types/pageTypes/vibesuite';

// In-memory progress storage (resets on server restart)
let progress: UserProgress = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ progress });
  }

  if (req.method === 'POST') {
    const { skillId, completed } = req.body as { skillId: string; completed: boolean };

    if (!getSkillById(skillId)) {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }

    if (completed) {
      progress[skillId] = { completed: true, completedAt: new Date().toISOString() };
    } else {
      delete progress[skillId];
    }

    return res.status(200).json({ progress });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
