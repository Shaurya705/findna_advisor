import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialHealthScore = ({ score, trend, language = 'en' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreLabel = (score, language) => {
    if (language === 'hi') {
      if (score >= 80) return 'उत्कृष्ट';
      if (score >= 60) return 'अच्छा';
      return 'सुधार की आवश्यकता';
    }
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const content = {
    en: {
      title: 'Financial Health Score',
      subtitle: 'Overall financial wellness',
      improvement: 'vs last month'
    },
    hi: {
      title: 'वित्तीय स्वास्थ्य स्कोर',
      subtitle: 'समग्र वित्तीय कल्याण',
      improvement: 'पिछले महीने की तुलना में'
    }
  };

  return (
    <div className="bg-white dark:bg-surface dark:bg-opacity-90 rounded-xl border border-border dark:border-border dark:border-opacity-30 p-6 shadow-sm hover:shadow-md dark:shadow-black dark:shadow-opacity-20 transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-1">
            {content?.[language]?.title}
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary/80">
            {content?.[language]?.subtitle}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-cultural rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Heart" size={24} color="white" strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-end justify-between mb-4">
        <div className="flex-1">
          <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}
          </div>
          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score, language)}
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <Icon 
            name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
            size={16} 
            color={trend > 0 ? "var(--color-success)" : "var(--color-error)"} 
          />
          <span className={`text-sm font-medium ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <span>{content?.[language]?.improvement}</span>
          <span>{score}/100</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-success' : score >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;