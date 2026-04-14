export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  id: string;
  name: string;
  projectTitle: string;
  projectDescription: string;
  difficulty: Difficulty;
  timeEstimate: string;
  tools: string[];
  dependsOn?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  skills: Skill[];
}

export interface UserProgress {
  [skillId: string]: {
    completed: boolean;
    completedAt: string;
  };
}

export interface UserProfile {
  name: string;
  joinedAt: string;
}

export interface NodePosition {
  x: number;
  y: number;
  z: number;
}

export type RecommendationReason =
  | 'unlocked'
  | 'hub'
  | 'difficulty_match'
  | 'quick_win'
  | 'diversity';

export interface Recommendation {
  skill: Skill;
  score: number;
  reasons: RecommendationReason[];
  reasonText: string;
}
