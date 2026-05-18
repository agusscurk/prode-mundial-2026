export interface UserProfile {
    id: string;
    name: string;
    document: string;
    champion_prediction: string;
    total_points: number;
    rank?: number;
}

export interface MatchInfo {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeFlag: string;
    awayFlag: string;
    scheduledTime: Date;
    status: 'available' | 'locked' | 'finished';
    actualScore?: { home: number; away: number };
    phase: 'Fase de Grupos' | 'Dieciseisavos' | 'Octavos' | 'Cuartos' | 'Semis' | 'Final';
}

export interface UserPrediction {
    matchId: string;
    homeGoals: number;
    awayGoals: number;
    pointsEarned: number;
}