// Achievement Categories
const CATEGORIES = {
    GENERAL: 'general',
    MECHANICS: 'mechanics',
    THERMODYNAMICS: 'thermodynamics',
    WAVES: 'waves',
    ELECTRICITY: 'electricity',
    MAGNETISM: 'magnetism',
    QUANTUM: 'quantum'
};

// Achievement Types
const TYPES = {
    PROGRESS: 'progress',      // Based on course progress
    ACCURACY: 'accuracy',      // Based on correct answers
    STREAK: 'streak',         // Based on consecutive correct answers
    SPEED: 'speed',          // Based on quick responses
    EXPLORATION: 'exploration', // Based on exploring different topics
    SOCIAL: 'social'         // Based on interactions with AI tutor
};

// Achievement Tiers
const TIERS = {
    BRONZE: { name: 'bronze', icon: '🥉' },
    SILVER: { name: 'silver', icon: '🥈' },
    GOLD: { name: 'gold', icon: '🥇' },
    SPECIAL: { name: 'special', icon: '⭐' }
};

// Achievement Definitions
const achievements = [
    // General Achievements
    {
        id: 'first_login',
        name: 'First Steps',
        description: 'Log in for the first time',
        category: CATEGORIES.GENERAL,
        type: TYPES.PROGRESS,
        tier: TIERS.BRONZE,
        icon: '🎯',
        condition: user => user.logins >= 1
    },
    {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Complete your first lesson',
        category: CATEGORIES.GENERAL,
        type: TYPES.PROGRESS,
        tier: TIERS.BRONZE,
        icon: '🎓',
        condition: user => user.completedLessons >= 1
    },
    
    // Mechanics Achievements
    {
        id: 'mechanics_master',
        name: 'Mechanics Master',
        description: 'Complete all mechanics lessons with 90%+ accuracy',
        category: CATEGORIES.MECHANICS,
        type: TYPES.ACCURACY,
        tier: TIERS.GOLD,
        icon: '🎯',
        condition: user => user.mechanics.progress === 100 && user.mechanics.accuracy >= 90
    },
    
    // Learning Streaks
    {
        id: 'quick_learner',
        name: 'Quick Learner',
        description: 'Get 5 correct answers in a row',
        category: CATEGORIES.GENERAL,
        type: TYPES.STREAK,
        tier: TIERS.BRONZE,
        icon: '⚡',
        condition: user => user.currentStreak >= 5
    },
    
    // AI Interaction
    {
        id: 'curious_mind',
        name: 'Curious Mind',
        description: 'Ask 10 questions to the AI tutor',
        category: CATEGORIES.GENERAL,
        type: TYPES.SOCIAL,
        tier: TIERS.BRONZE,
        icon: '🤔',
        condition: user => user.aiInteractions >= 10
    },
    
    // Special Achievements
    {
        id: 'physics_master',
        name: 'Physics Master',
        description: 'Complete all courses with 90%+ accuracy',
        category: CATEGORIES.GENERAL,
        type: TYPES.ACCURACY,
        tier: TIERS.SPECIAL,
        icon: '🏆',
        condition: user => (
            user.totalProgress === 100 && 
            user.averageAccuracy >= 90
        )
    }
];

// Helper Functions
function getAchievementById(id) {
    return achievements.find(a => a.id === id);
}

function getAchievementsByCategory(category) {
    return achievements.filter(a => a.category === category);
}

function getAchievementsByType(type) {
    return achievements.filter(a => a.type === type);
}

function getAchievementsByTier(tier) {
    return achievements.filter(a => a.tier.name === tier);
}

function checkAchievement(achievement, userData) {
    return achievement.condition(userData);
}

function checkAllAchievements(userData) {
    return achievements.filter(achievement => checkAchievement(achievement, userData));
}

// Export everything
export {
    CATEGORIES,
    TYPES,
    TIERS,
    achievements,
    getAchievementById,
    getAchievementsByCategory,
    getAchievementsByType,
    getAchievementsByTier,
    checkAchievement,
    checkAllAchievements
};