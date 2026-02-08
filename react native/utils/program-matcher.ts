import workoutPrograms from '@/constants/workoutprograms.json';

export interface ProgramRecommendation {
  name: string;
  description: string;
  initialTestMin: number;
  initialTestMax: number | null;
}

const programDescriptions: Record<string, string> = {
  'Beginner 1': 'Perfect for starting your push-up journey',
  'Beginner 2': 'Building a solid foundation',
  'Intermediate 1': 'Taking your strength to the next level',
  'Intermediate 2': 'Pushing toward advanced territory',
  'Advanced 1': 'Serious strength training',
  'Advanced 2': 'Elite-level progression',
};

export function findProgramForPushupCount(count: number): ProgramRecommendation {
  const programs = workoutPrograms.programs;

  for (const program of programs) {
    const min = program.initialTestMin;
    const max = program.initialTestMax;

    if (count >= min && (max === null || count <= max)) {
      return {
        name: program.name,
        description: programDescriptions[program.name] ?? '',
        initialTestMin: min,
        initialTestMax: max,
      };
    }
  }

  // Fallback to Beginner 1
  return {
    name: 'Beginner 1',
    description: programDescriptions['Beginner 1'],
    initialTestMin: 1,
    initialTestMax: 3,
  };
}

export function getAllPrograms(): ProgramRecommendation[] {
  return workoutPrograms.programs.map(p => ({
    name: p.name,
    description: programDescriptions[p.name] ?? '',
    initialTestMin: p.initialTestMin,
    initialTestMax: p.initialTestMax,
  }));
}
