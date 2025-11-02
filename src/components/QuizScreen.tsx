import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Screen, SkinProfile } from '../App';

interface QuizScreenProps {
  onNavigate: (screen: Screen) => void;
  onComplete: (profile: SkinProfile) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

const quizQuestions: Question[] = [
  {
    id: 'skinType',
    question: 'How would you describe your skin type?',
    type: 'single',
    options: [
      { value: 'oily', label: 'Oily', description: 'Shiny, enlarged pores, prone to breakouts' },
      { value: 'dry', label: 'Dry', description: 'Tight, flaky, may feel rough' },
      { value: 'combination', label: 'Combination', description: 'Oily T-zone, dry or normal cheeks' },
      { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive to products' },
      { value: 'normal', label: 'Normal', description: 'Well-balanced, rarely problematic' }
    ]
  },
  {
    id: 'concerns',
    question: 'What are your main skin concerns? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'acne', label: 'Acne & Breakouts' },
      { value: 'aging', label: 'Fine Lines & Wrinkles' },
      { value: 'hyperpigmentation', label: 'Dark Spots & Hyperpigmentation' },
      { value: 'dryness', label: 'Dryness & Dehydration' },
      { value: 'sensitivity', label: 'Sensitivity & Irritation' },
      { value: 'large-pores', label: 'Large Pores' },
      { value: 'dullness', label: 'Dullness & Uneven Texture' },
      { value: 'redness', label: 'Redness & Rosacea' }
    ]
  },
  {
    id: 'sensitivities',
    question: 'Do you have any known ingredient sensitivities?',
    type: 'multiple',
    options: [
      { value: 'fragrance', label: 'Fragrance' },
      { value: 'retinol', label: 'Retinol/Retinoids' },
      { value: 'acids', label: 'Alpha/Beta Hydroxy Acids' },
      { value: 'alcohol', label: 'Denatured Alcohol' },
      { value: 'sulfates', label: 'Sulfates' },
      { value: 'parabens', label: 'Parabens' },
      { value: 'essential-oils', label: 'Essential Oils' },
      { value: 'none', label: 'No known sensitivities' }
    ]
  },
  {
    id: 'age',
    question: 'What age range are you in?',
    type: 'single',
    options: [
      { value: 'teens', label: 'Under 18' },
      { value: '18-25', label: '18-25' },
      { value: '26-35', label: '26-35' },
      { value: '36-45', label: '36-45' },
      { value: '46-55', label: '46-55' },
      { value: '55+', label: '55+' }
    ]
  },
  {
    id: 'routine',
    question: 'How would you describe your current skincare routine?',
    type: 'single',
    options: [
      { value: 'minimal', label: 'Minimal', description: 'Cleanser and moisturizer only' },
      { value: 'basic', label: 'Basic', description: '3-4 products, morning and evening' },
      { value: 'moderate', label: 'Moderate', description: '5-7 products with some actives' },
      { value: 'extensive', label: 'Extensive', description: '8+ products with multiple actives' },
      { value: 'none', label: 'No routine', description: 'Just starting with skincare' }
    ]
  },
  {
    id: 'climate',
    question: 'What climate do you live in?',
    type: 'single',
    options: [
      { value: 'humid', label: 'Humid', description: 'Hot and humid most of the year' },
      { value: 'dry', label: 'Dry', description: 'Low humidity, arid conditions' },
      { value: 'temperate', label: 'Temperate', description: 'Moderate climate with seasonal changes' },
      { value: 'cold', label: 'Cold', description: 'Cold weather, low humidity in winter' },
      { value: 'tropical', label: 'Tropical', description: 'Consistently warm and humid' }
    ]
  }
];

export function QuizScreen({ onNavigate, onComplete }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isComplete, setIsComplete] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers };
    
    if (question.type === 'single') {
      newAnswers[question.id] = value;
    } else {
      const currentValues = (newAnswers[question.id] as string[]) || [];
      if (currentValues.includes(value)) {
        newAnswers[question.id] = currentValues.filter(v => v !== value);
      } else {
        newAnswers[question.id] = [...currentValues, value];
      }
    }
    
    setAnswers(newAnswers);
  };

  const canProceed = () => {
    const answer = answers[question.id];
    if (question.type === 'single') {
      return answer && answer !== '';
    } else {
      return answer && (answer as string[]).length > 0;
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeQuiz = () => {
    const profile: SkinProfile = {
      skinType: answers.skinType as string,
      concerns: answers.concerns as string[] || [],
      sensitivities: answers.sensitivities as string[] || [],
      age: answers.age as string,
      routine: answers.routine as string,
      climate: answers.climate as string
    };
    
    onComplete(profile);
    setIsComplete(true);
  };

  const getPersonalizedInsights = () => {
    if (!isComplete) return [];
    
    const insights = [];
    const profile = {
      skinType: answers.skinType as string,
      concerns: answers.concerns as string[] || [],
      sensitivities: answers.sensitivities as string[] || []
    };

    // Skin type insights
    if (profile.skinType === 'oily') {
      insights.push('Look for oil-free, non-comedogenic products with salicylic acid or niacinamide');
    } else if (profile.skinType === 'dry') {
      insights.push('Focus on hydrating ingredients like hyaluronic acid and ceramides');
    } else if (profile.skinType === 'sensitive') {
      insights.push('Avoid fragrances, alcohols, and harsh actives. Look for gentle, fragrance-free formulas');
    }

    // Concern-based insights
    if (profile.concerns.includes('acne')) {
      insights.push('Products with salicylic acid, benzoyl peroxide, or retinoids may help');
    }
    if (profile.concerns.includes('aging')) {
      insights.push('Look for retinoids, vitamin C, and peptides for anti-aging benefits');
    }
    if (profile.concerns.includes('hyperpigmentation')) {
      insights.push('Vitamin C, kojic acid, and arbutin can help with dark spots');
    }

    return insights;
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with Image */}
        <Card className="p-0 bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 overflow-hidden">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1743309026555-97f545a08490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMG1pbmltYWx8ZW58MXx8fHwxNzYxNTc3OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Quiz complete"
              className="w-full h-48 object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 bg-white/90 rounded-2xl p-8 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Your Skin Profile is Complete!
                </h1>
              </div>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-700">
              We've analyzed your responses to create personalized product recommendations
            </p>
          </div>
        </Card>

        {/* Profile Summary */}
        <Card className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <h3 className="text-lg mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-pink-600" />
            <span>Your Skin Profile</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Skin Type</p>
              <Badge className="bg-pink-100 text-pink-700 border-pink-300 capitalize">
                {answers.skinType as string}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Age Range</p>
              <Badge className="bg-rose-100 text-rose-700 border-rose-300">
                {answers.age as string}
              </Badge>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-2">Main Concerns</p>
              <div className="flex flex-wrap gap-2">
                {(answers.concerns as string[] || []).map(concern => (
                  <Badge key={concern} variant="outline" className="text-pink-700 border-pink-300">
                    {concern.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-2">Sensitivities to Avoid</p>
              <div className="flex flex-wrap gap-2">
                {(answers.sensitivities as string[] || []).filter(s => s !== 'none').map(sensitivity => (
                  <Badge key={sensitivity} variant="outline" className="text-red-700 border-red-300">
                    {sensitivity.replace('-', ' ')}
                  </Badge>
                ))}
                {(answers.sensitivities as string[] || []).includes('none') && (
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    No known sensitivities
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Personalized Insights */}
        <Card className="p-6">
          <h3 className="text-lg mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <span>Personalized Insights</span>
          </h3>
          
          <div className="space-y-3">
            {getPersonalizedInsights().map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => onNavigate('home')}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            Start Analyzing Products
          </Button>
          <Button 
            onClick={() => onNavigate('profile')}
            variant="outline"
            className="flex-1 border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            View Full Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('home')}
          className="text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Skin Analysis Quiz
          </h1>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Getting to know your skin</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 bg-white/70 border-pink-200">
        <h2 className="text-xl mb-6 text-center">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = question.type === 'single' 
              ? answers[question.id] === option.value
              : (answers[question.id] as string[] || []).includes(option.value);
            
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-pink-400 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-pink-300 text-pink-700 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white disabled:opacity-50"
        >
          {currentQuestion === quizQuestions.length - 1 ? 'Complete Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
