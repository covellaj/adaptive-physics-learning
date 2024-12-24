export const physicsTopics = {
    mechanics: {
        name: "Mechanics",
        description: "The study of motion, forces, and energy",
        icon: "🎯",
        subtopics: {
            kinematics: {
                name: "Kinematics",
                description: "Motion in one and two dimensions",
                icon: "📏",
                difficulty: 1,
                prerequisites: [],
                concepts: [
                    "Position and displacement",
                    "Velocity and acceleration",
                    "Motion graphs",
                    "Projectile motion"
                ]
            },
            forces: {
                name: "Forces",
                description: "Newton's laws and their applications",
                icon: "🎯",
                difficulty: 2,
                prerequisites: ["kinematics"],
                concepts: [
                    "Newton's laws of motion",
                    "Free body diagrams",
                    "Friction and normal force",
                    "Tension and springs"
                ]
            },
            energy: {
                name: "Energy",
                description: "Work, energy, and conservation laws",
                icon: "⚡",
                difficulty: 2,
                prerequisites: ["forces"],
                concepts: [
                    "Work and power",
                    "Kinetic and potential energy",
                    "Conservation of energy",
                    "Collisions"
                ]
            },
            momentum: {
                name: "Momentum",
                description: "Linear and angular momentum",
                icon: "🔄",
                difficulty: 3,
                prerequisites: ["energy"],
                concepts: [
                    "Linear momentum",
                    "Conservation of momentum",
                    "Impulse",
                    "Center of mass"
                ]
            },
            rotation: {
                name: "Rotational Motion",
                description: "Angular kinematics and dynamics",
                icon: "🌟",
                difficulty: 3,
                prerequisites: ["momentum"],
                concepts: [
                    "Angular velocity and acceleration",
                    "Torque",
                    "Rotational inertia",
                    "Angular momentum"
                ]
            }
        }
    },
    thermodynamics: {
        name: "Thermodynamics",
        description: "The study of heat, temperature, and energy transfer",
        icon: "🌡️",
        subtopics: {
            temperature: {
                name: "Temperature & Heat",
                description: "Basic concepts of thermal physics",
                icon: "🌡️",
                difficulty: 1,
                prerequisites: ["energy"],
                concepts: [
                    "Temperature scales",
                    "Heat transfer",
                    "Thermal expansion",
                    "Specific heat capacity"
                ]
            },
            gases: {
                name: "Gases & Kinetic Theory",
                description: "Behavior of gases and particle motion",
                icon: "💨",
                difficulty: 2,
                prerequisites: ["temperature"],
                concepts: [
                    "Ideal gas law",
                    "Kinetic theory",
                    "Gas processes",
                    "Real gases"
                ]
            },
            laws: {
                name: "Laws of Thermodynamics",
                description: "Fundamental principles of energy transfer",
                icon: "📊",
                difficulty: 3,
                prerequisites: ["gases"],
                concepts: [
                    "First law of thermodynamics",
                    "Second law of thermodynamics",
                    "Entropy",
                    "Heat engines"
                ]
            }
        }
    },
    waves: {
        name: "Waves & Oscillations",
        description: "The study of periodic motion and wave phenomena",
        icon: "〰️",
        subtopics: {
            // To be populated
        }
    },
    em: {
        name: "Electricity & Magnetism",
        description: "The study of electric and magnetic phenomena",
        icon: "⚡",
        subtopics: {
            // To be populated
        }
    },
    modern: {
        name: "Modern Physics",
        description: "Quantum mechanics and relativity",
        icon: "✨",
        subtopics: {
            // To be populated
        }
    }
};

// Helper functions for working with the physics course data
export function getSubtopicsByTopic(topicKey) {
    return physicsTopics[topicKey]?.subtopics || {};
}

export function checkPrerequisites(topicKey, subtopicKey, completedSubtopics) {
    const subtopic = physicsTopics[topicKey]?.subtopics[subtopicKey];
    if (!subtopic) return false;
    
    return subtopic.prerequisites.every(prereq => completedSubtopics.includes(prereq));
}

export function getNextSubtopics(completedSubtopics) {
    const available = [];
    
    Object.entries(physicsTopics).forEach(([topicKey, topic]) => {
        Object.entries(topic.subtopics).forEach(([subtopicKey, subtopic]) => {
            if (!completedSubtopics.includes(subtopicKey) && 
                subtopic.prerequisites.every(prereq => completedSubtopics.includes(prereq))) {
                available.push({
                    topicKey,
                    subtopicKey,
                    ...subtopic
                });
            }
        });
    });
    
    return available;
}

export function getDifficultyLabel(level) {
    switch(level) {
        case 1: return "Beginner";
        case 2: return "Intermediate";
        case 3: return "Advanced";
        default: return "Unknown";
    }
}