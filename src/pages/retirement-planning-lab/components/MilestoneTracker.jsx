import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MilestoneTracker = ({ goalData }) => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [celebrationMode, setCelebrationMode] = useState(false);

  const currentAge = parseInt(goalData?.currentAge || 30);
  const retirementAge = parseInt(goalData?.retirementAge || 60);
  const yearsToRetirement = retirementAge - currentAge;
  const monthlyInvestment = 25000; // Mock value

  // Generate milestone data
  const generateMilestones = () => {
    const milestones = [];
    const totalYears = yearsToRetirement;
    const milestoneInterval = Math.max(2, Math.floor(totalYears / 8));
    
    for (let i = 1; i <= Math.floor(totalYears / milestoneInterval); i++) {
      const year = i * milestoneInterval;
      const age = currentAge + year;
      const corpus = monthlyInvestment * 12 * year * 1.1 ** year; // Simplified calculation
      
      milestones?.push({
        id: i,
        year,
        age,
        title: `${year} Year Milestone`,
        description: `Reach ₹${(corpus / 100000)?.toFixed(1)}L corpus by age ${age}`,
        targetAmount: corpus,
        currentAmount: corpus * (Math.random() * 0.3 + 0.1), // Mock current progress
        isCompleted: Math.random() > 0.7,
        isUpcoming: year <= 5,
        category: year <= totalYears * 0.3 ? 'early' : year <= totalYears * 0.7 ? 'mid' : 'late',
        recommendations: [
          `Increase SIP by ₹${Math.floor(Math.random() * 5000 + 2000)} if possible`,
          `Review and rebalance portfolio allocation`,
          `Consider tax-saving investments for this year`
        ]
      });
    }
    
    // Add final retirement milestone
    milestones?.push({
      id: milestones?.length + 1,
      year: totalYears,
      age: retirementAge,
      title: 'Retirement Goal',
      description: `Complete retirement corpus of ₹${((monthlyInvestment * 12 * totalYears * 1.1 ** totalYears) / 10000000)?.toFixed(1)}Cr`,
      targetAmount: monthlyInvestment * 12 * totalYears * 1.1 ** totalYears,
      currentAmount: 0,
      isCompleted: false,
      isUpcoming: false,
      category: 'final',
      recommendations: [
        'Gradually shift to conservative investments',
        'Plan for post-retirement income streams',
        'Consider healthcare and inflation protection'
      ]
    });
    
    return milestones;
  };

  const milestones = generateMilestones();
  const completedMilestones = milestones?.filter(m => m?.isCompleted)?.length;
  const upcomingMilestones = milestones?.filter(m => m?.isUpcoming && !m?.isCompleted);
  const nextMilestone = milestones?.find(m => !m?.isCompleted);

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000)?.toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000)?.toFixed(0)}K`;
    return `₹${value}`;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(100, (current / target) * 100);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'early': return 'text-success bg-success/10 border-success/20';
      case 'mid': return 'text-prosperity bg-prosperity/10 border-prosperity/20';
      case 'late': return 'text-warning bg-warning/10 border-warning/20';
      case 'final': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const handleCelebration = (milestone) => {
    setCelebrationMode(true);
    setSelectedMilestone(milestone);
    setTimeout(() => setCelebrationMode(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Completed</p>
              <p className="text-2xl font-bold text-success">{completedMilestones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-prosperity/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-prosperity" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Upcoming</p>
              <p className="text-2xl font-bold text-prosperity">{upcomingMilestones?.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Years Left</p>
              <p className="text-2xl font-bold text-primary">{yearsToRetirement}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-growth/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-growth" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Progress</p>
              <p className="text-2xl font-bold text-growth">
                {Math.round((completedMilestones / milestones?.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Next Milestone Highlight */}
      {nextMilestone && (
        <div className="bg-gradient-cultural rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Next Milestone</h3>
                <p className="text-white/80">{nextMilestone?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(nextMilestone?.targetAmount)}</p>
                <p className="text-white/80">Target Amount</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{getProgressPercentage(nextMilestone?.currentAmount, nextMilestone?.targetAmount)?.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${getProgressPercentage(nextMilestone?.currentAmount, nextMilestone?.targetAmount)}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-white/80">
                {formatCurrency(nextMilestone?.targetAmount - nextMilestone?.currentAmount)} remaining
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                iconName="Zap"
                iconPosition="left"
              >
                Boost Progress
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Milestone Timeline */}
      <div className="bg-white rounded-xl shadow-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">
            Retirement Milestone Timeline
          </h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export Plan
          </Button>
        </div>

        <div className="space-y-4">
          {milestones?.map((milestone, index) => (
            <div 
              key={milestone?.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                milestone?.isCompleted 
                  ? 'bg-success/5 border-success/20' 
                  : milestone?.isUpcoming 
                    ? 'bg-prosperity/5 border-prosperity/20' :'bg-muted border-border'
              } ${selectedMilestone?.id === milestone?.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedMilestone(selectedMilestone?.id === milestone?.id ? null : milestone)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone?.isCompleted 
                      ? 'bg-success text-white' 
                      : milestone?.isUpcoming 
                        ? 'bg-prosperity text-white' :'bg-muted text-text-secondary'
                  }`}>
                    {milestone?.isCompleted ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <span className="font-bold">{milestone?.year}Y</span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-text-primary">{milestone?.title}</h4>
                    <p className="text-sm text-text-secondary">{milestone?.description}</p>
                    <p className="text-xs text-text-muted">Age: {milestone?.age}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-text-primary">{formatCurrency(milestone?.targetAmount)}</p>
                  {!milestone?.isCompleted && (
                    <div className="text-xs text-text-secondary">
                      {getProgressPercentage(milestone?.currentAmount, milestone?.targetAmount)?.toFixed(0)}% complete
                    </div>
                  )}
                  {milestone?.isCompleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Party"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleCelebration(milestone);
                      }}
                      className="text-success hover:bg-success/10"
                    >
                      Celebrate
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Progress Bar for incomplete milestones */}
              {!milestone?.isCompleted && milestone?.currentAmount > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className="bg-prosperity rounded-full h-1 transition-all duration-500"
                      style={{ width: `${getProgressPercentage(milestone?.currentAmount, milestone?.targetAmount)}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Expanded Details */}
              {selectedMilestone?.id === milestone?.id && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-text-primary mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {milestone?.recommendations?.map((rec, idx) => (
                          <li key={idx} className="text-sm text-text-secondary flex items-start space-x-2">
                            <Icon name="ArrowRight" size={12} className="mt-1 text-prosperity" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-text-primary mb-2">Key Metrics</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Target:</span>
                          <span className="font-semibold">{formatCurrency(milestone?.targetAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Current:</span>
                          <span className="font-semibold">{formatCurrency(milestone?.currentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Remaining:</span>
                          <span className="font-semibold text-prosperity">
                            {formatCurrency(milestone?.targetAmount - milestone?.currentAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Celebration Modal */}
      {celebrationMode && selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center animate-slide-up">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={32} color="white" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-text-secondary mb-4">
              You've successfully completed the {selectedMilestone?.title}!
            </p>
            <p className="text-sm text-text-muted mb-6">
              Keep up the great work on your retirement journey.
            </p>
            <Button
              variant="default"
              onClick={() => setCelebrationMode(false)}
              className="bg-gradient-cultural"
            >
              Continue Planning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;