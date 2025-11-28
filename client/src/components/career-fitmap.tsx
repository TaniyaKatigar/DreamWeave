import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CareerMatchResult } from "@shared/schema";

export default function CareerFitmap({ matchResult }: { matchResult: CareerMatchResult }) {
  const { breakdown, matchScore } = matchResult;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="text-lg">Career Fit Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Match Score */}
        <div className="text-center space-y-3">
          <div className="text-5xl font-bold text-primary">{matchScore}%</div>
          <p className="text-sm text-muted-foreground">Overall Match Score</p>
        </div>

        {/* Match Breakdown */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Personality Match</span>
              <span className="text-sm text-primary font-bold">{breakdown.personalityMatch}%</span>
            </div>
            <Progress value={breakdown.personalityMatch} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Skills Match</span>
              <span className="text-sm text-primary font-bold">{breakdown.skillsMatch}%</span>
            </div>
            <Progress value={breakdown.skillsMatch} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Interests Match</span>
              <span className="text-sm text-primary font-bold">{breakdown.interestsMatch}%</span>
            </div>
            <Progress value={breakdown.interestsMatch} className="h-2" />
          </div>
        </div>

        {/* AI Insights */}
        <div className="pt-4 border-t space-y-3">
          <h4 className="font-semibold text-sm">ML Engine Prediction Factors</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Your personality traits align {breakdown.personalityMatch > 70 ? "strongly" : "moderately"} with this career's requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Your skill set shows {breakdown.skillsMatch > 70 ? "excellent" : breakdown.skillsMatch > 50 ? "good" : "developing"} compatibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Your interests are {breakdown.interestsMatch > 70 ? "highly" : "moderately"} aligned with this field</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
