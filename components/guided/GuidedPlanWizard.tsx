"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { X, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import type { 
  FitnessGoal, 
  PrimaryGoal, 
  ExperienceLevel, 
  TrainingFrequency, 
  SessionLength,
  Equipment,
  Constraint,
  GuidedPlanInput 
} from "@/types/guided-plan"

interface GuidedPlanWizardProps {
  onComplete: (input: GuidedPlanInput) => void
  onClose: () => void
}

export function GuidedPlanWizard({ onComplete, onClose }: GuidedPlanWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<GuidedPlanInput>>({
    primaryGoals: [],
    equipment: [],
    constraints: []
  })

  const totalSteps = 7

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    if (isFormComplete()) {
      onComplete(formData as GuidedPlanInput)
    }
  }

  const isFormComplete = () => {
    return !!(
      formData.fitnessGoal &&
      formData.primaryGoals && formData.primaryGoals.length > 0 &&
      formData.experienceLevel &&
      formData.trainingFrequency &&
      formData.sessionLength &&
      formData.equipment && formData.equipment.length > 0
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.fitnessGoal
      case 2: return formData.primaryGoals && formData.primaryGoals.length > 0
      case 3: return !!formData.experienceLevel
      case 4: return !!formData.trainingFrequency && !!formData.sessionLength
      case 5: return formData.equipment && formData.equipment.length > 0
      case 6: return true // Optional
      case 7: return isFormComplete()
      default: return false
    }
  }

  const toggleArrayItem = <T,>(array: T[], item: T, maxItems?: number): T[] => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    } else {
      if (maxItems && array.length >= maxItems) {
        return [...array.slice(1), item]
      }
      return [...array, item]
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-bg-card rounded-2xl overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-bg-card backdrop-blur-sm p-6 border-b border-white/10 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Your Plan</h2>
              <p className="text-sm text-text-muted mt-1">Step {step} of {totalSteps}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-6 h-6 text-text-muted" />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {/* Step 1: Fitness Goal */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">What Are You Trying to Achieve?</h3>
                <p className="text-text-muted text-sm">Choose your primary focus</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'build_muscle' as FitnessGoal, label: 'Build Muscle (Bulk)', emoji: '💪', desc: 'Increase muscle mass and size' },
                  { value: 'lose_fat' as FitnessGoal, label: 'Lose Fat (Cut)', emoji: '🔥', desc: 'Reduce body fat percentage' },
                  { value: 'recomp' as FitnessGoal, label: 'Recomp', emoji: '⚡', desc: 'Build muscle + lose fat' },
                  { value: 'get_stronger' as FitnessGoal, label: 'Get Stronger', emoji: '🏋️', desc: 'Increase max strength' },
                  { value: 'rehab' as FitnessGoal, label: 'Return From Injury', emoji: '🩹', desc: 'Rebuild strength safely' },
                  { value: 'maintain' as FitnessGoal, label: 'Maintain / Stay Active', emoji: '✨', desc: 'Keep current fitness level' },
                ].map((goal) => (
                  <Card
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, fitnessGoal: goal.value })}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:scale-105",
                      formData.fitnessGoal === goal.value 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{goal.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{goal.label}</h4>
                        <p className="text-xs text-text-muted">{goal.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Primary Goals */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Primary Goal</h3>
                <p className="text-text-muted text-sm">Select up to 2 specific targets</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'increase_strength' as PrimaryGoal, label: 'Increase Strength', icon: '🏋️' },
                  { value: 'improve_endurance' as PrimaryGoal, label: 'Improve Endurance', icon: '🏃' },
                  { value: 'improve_mobility' as PrimaryGoal, label: 'Improve Mobility', icon: '🧘' },
                  { value: 'look_leaner' as PrimaryGoal, label: 'Look Leaner', icon: '✨' },
                  { value: 'athletic_performance' as PrimaryGoal, label: 'Athletic Performance', icon: '⚡' },
                  { value: 'improve_consistency' as PrimaryGoal, label: 'Improve Consistency', icon: '📈' },
                ].map((goal) => (
                  <Card
                    key={goal.value}
                    onClick={() => setFormData({ 
                      ...formData, 
                      primaryGoals: toggleArrayItem(formData.primaryGoals || [], goal.value, 2)
                    })}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      (formData.primaryGoals || []).includes(goal.value)
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-medium text-white">{goal.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
              {formData.primaryGoals && formData.primaryGoals.length >= 2 && (
                <p className="text-xs text-center text-yellow-400">Maximum 2 goals selected</p>
              )}
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Experience Level</h3>
                <p className="text-text-muted text-sm">How long have you been training consistently?</p>
              </div>
              
              <div className="space-y-3 max-w-md mx-auto">
                {[
                  { value: 'beginner' as ExperienceLevel, label: 'Beginner', time: '0-6 months', desc: 'New to structured training' },
                  { value: 'intermediate' as ExperienceLevel, label: 'Intermediate', time: '6-24 months', desc: 'Comfortable with basics' },
                  { value: 'advanced' as ExperienceLevel, label: 'Advanced', time: '2+ years', desc: 'Experienced lifter' },
                ].map((level) => (
                  <Card
                    key={level.value}
                    onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                    className={cn(
                      "p-5 cursor-pointer transition-all hover:scale-102",
                      formData.experienceLevel === level.value
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white mb-1">{level.label}</h4>
                        <p className="text-sm text-primary">{level.time}</p>
                        <p className="text-xs text-text-muted mt-1">{level.desc}</p>
                      </div>
                      {formData.experienceLevel === level.value && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Training Availability */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Training Availability</h3>
                <p className="text-text-muted text-sm">How often can you train?</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-3 block">Days per week</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '2-3' as TrainingFrequency, label: '2-3 days' },
                      { value: '3-4' as TrainingFrequency, label: '3-4 days' },
                      { value: '5+' as TrainingFrequency, label: '5+ days' },
                    ].map((freq) => (
                      <Card
                        key={freq.value}
                        onClick={() => setFormData({ ...formData, trainingFrequency: freq.value })}
                        className={cn(
                          "p-4 cursor-pointer text-center transition-all",
                          formData.trainingFrequency === freq.value
                            ? "border-primary bg-primary/10" 
                            : "border-white/10"
                        )}
                      >
                        <span className="font-medium text-white text-sm">{freq.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary mb-3 block">Session length</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 30 as SessionLength, label: '30 min' },
                      { value: 45 as SessionLength, label: '45 min' },
                      { value: 60 as SessionLength, label: '60+ min' },
                    ].map((duration) => (
                      <Card
                        key={duration.value}
                        onClick={() => setFormData({ ...formData, sessionLength: duration.value })}
                        className={cn(
                          "p-4 cursor-pointer text-center transition-all",
                          formData.sessionLength === duration.value
                            ? "border-primary bg-primary/10" 
                            : "border-white/10"
                        )}
                      >
                        <span className="font-medium text-white text-sm">{duration.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Equipment */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Equipment Access</h3>
                <p className="text-text-muted text-sm">Select all that apply</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  { value: 'dumbbells' as Equipment, label: 'Dumbbells', emoji: '🏋️' },
                  { value: 'barbells' as Equipment, label: 'Barbells', emoji: '🥇' },
                  { value: 'machines' as Equipment, label: 'Machines', emoji: '⚙️' },
                  { value: 'bands' as Equipment, label: 'Bands', emoji: '🎗️' },
                  { value: 'bodyweight' as Equipment, label: 'Bodyweight', emoji: '💪' },
                  { value: 'cardio_machines' as Equipment, label: 'Cardio Machines', emoji: '🏃' },
                ].map((equip) => (
                  <Card
                    key={equip.value}
                    onClick={() => setFormData({ 
                      ...formData, 
                      equipment: toggleArrayItem(formData.equipment || [], equip.value)
                    })}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      (formData.equipment || []).includes(equip.value)
                        ? "border-primary bg-primary/10" 
                        : "border-white/10"
                    )}
                  >
                    <div className="text-center space-y-2">
                      <span className="text-3xl">{equip.emoji}</span>
                      <p className="font-medium text-white text-sm">{equip.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Constraints (Optional) */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Any Constraints?</h3>
                <p className="text-text-muted text-sm">Optional - Select if applicable</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {[
                  { value: 'knee_issues' as Constraint, label: 'Knee Issues', icon: '🦵' },
                  { value: 'back_issues' as Constraint, label: 'Back Issues', icon: '🔙' },
                  { value: 'shoulder_issues' as Constraint, label: 'Shoulder Issues', icon: '💪' },
                  { value: 'cardio_first' as Constraint, label: 'Prefer Cardio First', icon: '🏃' },
                  { value: 'home_workouts' as Constraint, label: 'Home Workouts', icon: '🏠' },
                ].map((constraint) => (
                  <Card
                    key={constraint.value}
                    onClick={() => setFormData({ 
                      ...formData, 
                      constraints: toggleArrayItem(formData.constraints || [], constraint.value)
                    })}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      (formData.constraints || []).includes(constraint.value)
                        ? "border-primary bg-primary/10" 
                        : "border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{constraint.icon}</span>
                      <span className="font-medium text-white text-sm">{constraint.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-center text-xs text-text-muted">These help us customize exercises for your safety</p>
            </div>
          )}

          {/* Step 7: Review */}
          {step === 7 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Ready to Start!</h3>
                <p className="text-text-muted text-sm">Your personalized plan will be generated</p>
              </div>
              
              <div className="space-y-3 max-w-md mx-auto">
                <Card className="p-4 bg-white/5">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Goal:</span>
                      <span className="text-white font-medium">{formData.fitnessGoal?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Level:</span>
                      <span className="text-white font-medium capitalize">{formData.experienceLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Frequency:</span>
                      <span className="text-white font-medium">{formData.trainingFrequency} days/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Duration:</span>
                      <span className="text-white font-medium">{formData.sessionLength} min/session</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Equipment:</span>
                      <span className="text-white font-medium">{formData.equipment?.length} types</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-bg-card backdrop-blur-sm p-6 border-t border-white/10 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={step === 1 ? onClose : handleBack}
            disabled={step === 7 && !canProceed()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          {step < 7 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[120px]"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isFormComplete()}
              className="min-w-[120px] bg-success hover:bg-success/80"
            >
              Generate Plan
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

