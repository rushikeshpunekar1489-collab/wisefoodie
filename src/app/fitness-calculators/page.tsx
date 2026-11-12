import React from 'react';
import type { Metadata } from 'next';
import FitnessClient from './FitnessClient';

export const metadata: Metadata = {
  title: 'Fitness & Indian Nutrition Hub | WiseFoodies',
  description:
    'Scientific fitness calculators (BMI, Body Fat %, Daily Calories, Ideal Weight) and comprehensive Indian Food Nutrition Database from INDB and ICMR-NIN with multilingual search and oil breakdown.',
  keywords: [
    'BMI Calculator India',
    'Body Fat Calculator',
    'Daily Calorie Calculator',
    'Ideal Weight Calculator',
    'Indian Nutrition Database',
    'INDB',
    'ICMR NIN Food Composition',
    'Indian Food Calories',
    'Cooking Oil Breakdown',
    'WiseFoodies',
  ],
};

export default function FitnessCalculatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16">
      <FitnessClient />
    </div>
  );
}
