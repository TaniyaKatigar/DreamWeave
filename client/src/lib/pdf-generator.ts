import jsPDF from "jspdf";
import type { Career, CareerMatchResult } from "@shared/schema";
import { formatSalary } from "./careerData";

export function generateCareerReport(
  matchResult: CareerMatchResult,
  userName: string = "Student"
): void {
  const { career, matchScore, breakdown } = matchResult;
  const doc = new jsPDF();

  const primaryColor = [33, 150, 243]; // Blue
  const textColor = [51, 51, 51];
  const lightGray = [240, 240, 240];

  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DreamWave Career Report", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 32);
  doc.text(`For: ${userName}`, 20, 37);

  doc.setLineWidth(0.5);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.line(20, 40, 190, 40);

  let yPos = 50;

  doc.setFontSize(18);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(career.title, 20, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(career.category, 20, yPos);

  yPos += 15;
  doc.setFontSize(11);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const descLines = doc.splitTextToSize(career.description, 170);
  doc.text(descLines, 20, yPos);
  yPos += descLines.length * 6 + 10;

  const matchScoreX = 150;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(matchScoreX, 50, 35, 35, 3, 3, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${matchScore}%`, matchScoreX + 17.5, 70, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('Match', matchScoreX + 17.5, 77, { align: 'center' });
  doc.text('Score', matchScoreX + 17.5, 82, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Career Insights", 20, yPos);
  yPos += 10;

  const insights = [
    { label: "Salary Range", value: formatSalary(career.salaryRange.min, career.salaryRange.max) },
    { label: "Growth Potential", value: `${career.growthPotential}% - ${career.growthPotential > 85 ? 'Excellent' : 'Good'}` },
    { label: "Stress Level", value: `${career.stressIndex}% - ${career.stressIndex < 50 ? 'Low' : career.stressIndex < 75 ? 'Moderate' : 'High'}` },
    { label: "Mismatch Risk", value: `${career.mismatchProbability}% - ${career.mismatchProbability < 20 ? 'Very Low' : 'Low'}` },
  ];

  doc.setFontSize(10);
  insights.forEach((insight) => {
    doc.setTextColor(128, 128, 128);
    doc.text(insight.label + ":", 25, yPos);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(insight.value, 65, yPos);
    yPos += 7;
  });

  yPos += 8;
  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Match Breakdown", 20, yPos);
  yPos += 10;

  const breakdownData = [
    { label: "Personality Match", value: breakdown.personalityMatch },
    { label: "Skills Match", value: breakdown.skillsMatch },
    { label: "Interests Match", value: breakdown.interestsMatch },
  ];

  doc.setFontSize(10);
  breakdownData.forEach((item) => {
    doc.setTextColor(128, 128, 128);
    doc.text(item.label + ":", 25, yPos);
    
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(65, yPos - 4, 100, 5, 'F');
    
    const barWidth = (item.value / 100) * 100;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(65, yPos - 4, barWidth, 5, 'F');
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${item.value}%`, 170, yPos);
    
    yPos += 10;
  });

  yPos += 8;
  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Industry Trends", 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const trendsLines = doc.splitTextToSize(career.industryTrends, 170);
  doc.text(trendsLines, 20, yPos);
  yPos += trendsLines.length * 6 + 10;

  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Required Skills", 20, yPos);
  yPos += 7;

  doc.setFontSize(9);
  let xPos = 20;
  career.requiredSkills.forEach((skill, idx) => {
    const skillWidth = doc.getTextWidth(skill) + 8;
    
    if (xPos + skillWidth > 190) {
      xPos = 20;
      yPos += 8;
    }
    
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(xPos, yPos - 4, skillWidth, 6, 2, 2, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(skill, xPos + 4, yPos);
    
    xPos += skillWidth + 4;
  });

  yPos += 12;
  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Recommended Next Steps", 20, yPos);
  yPos += 8;

  const nextSteps = [
    "Research educational pathways and degree programs for this career",
    "Connect with professionals in this field for informational interviews",
    "Explore internship opportunities to gain hands-on experience",
    "Develop the required skills through online courses or workshops",
    "Join relevant communities and professional associations",
  ];

  doc.setFontSize(10);
  nextSteps.forEach((step, idx) => {
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${idx + 1}.`, 22, yPos);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const stepLines = doc.splitTextToSize(step, 160);
    doc.text(stepLines, 30, yPos);
    yPos += stepLines.length * 6 + 2;
  });

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("Generated by DreamWave - Experience Your Future Career", 105, 285, { align: 'center' });

  doc.save(`DreamWave_${career.title.replace(/\s+/g, '_')}_Report.pdf`);
}
