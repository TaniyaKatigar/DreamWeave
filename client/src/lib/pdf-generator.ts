import jsPDF from "jspdf";
import type { Career, CareerMatchResult } from "@shared/schema";
import { formatSalary } from "./careerData";

export function generateCareerReport(
  matchResult: CareerMatchResult,
  userName: string = "Student"
): void {
  const { career, matchScore, breakdown } = matchResult;
  const doc = new jsPDF();

  const primaryColor = [33, 150, 243];
  const accentColor = [76, 175, 80];
  const textColor = [40, 40, 40];
  const lightGray = [245, 245, 245];
  const borderGray = [220, 220, 220];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margins = { top: 15, left: 18, right: 18, bottom: 20 };
  const contentWidth = pageWidth - 2 * margins.left;
  const pageBottomLimit = pageHeight - margins.bottom - 10;

  let yPos = margins.top;

  // Helper function to add a new page with header
  const addNewPage = () => {
    doc.addPage();
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFontSize(10);
    doc.setTextColor(200, 220, 255);
    doc.text("DreamWeave - Career Insights Report", margins.left, 16);
    yPos = margins.top + 25;
  };

  // Helper function to check if content fits and add page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageBottomLimit) {
      addNewPage();
    }
  };

  // Page 1 Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("DreamWeave", margins.left, 18);

  doc.setFontSize(10);
  doc.setTextColor(200, 220, 255);
  doc.text("Career Insights Report", margins.left, 28);

  yPos = 45;

  // Career Title Section
  checkPageBreak(40);

  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(career.title, margins.left, yPos);
  yPos += 9;

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(career.category, margins.left, yPos);
  yPos += 12;

  // Description
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const descLines = doc.splitTextToSize(career.description, contentWidth - 55);
  doc.text(descLines, margins.left, yPos);
  const descHeight = descLines.length * 5.5;
  
  // Match Score Box (positioned on right side, aligned with description start)
  const boxWidth = 50;
  const boxHeight = 45;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(1);
  doc.rect(pageWidth - margins.right - boxWidth, yPos - 2, boxWidth, boxHeight, 'FD');

  doc.setFontSize(28);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${matchScore}%`, pageWidth - margins.right - boxWidth / 2, yPos + 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Match Score", pageWidth - margins.right - boxWidth / 2, yPos + 30, { align: 'center' });

  yPos += Math.max(descHeight + 8, boxHeight + 5);

  // Section Divider
  checkPageBreak(15);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(margins.left, yPos, pageWidth - margins.right, yPos);
  yPos += 10;

  // Career Insights Section
  checkPageBreak(45);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("Career Insights", margins.left, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;

  // Helper function to format salary properly for PDF
  const formatSalaryForPDF = (min: number, max: number) => {
    const formatVal = (val: number) => {
      if (val >= 10000000) return `Rs.${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `Rs.${(val / 100000).toFixed(0)}L`;
      if (val > 0) return `Rs.${(val / 1000).toFixed(0)}K`;
      return "Rs.0";
    };
    return `${formatVal(min)} - ${formatVal(max)}`;
  };

  const insights = [
    { label: "Salary Range", value: formatSalaryForPDF(career.salaryRange.min, career.salaryRange.max) },
    { label: "Growth Potential", value: `${career.growthPotential}%` },
    { label: "Stress Level", value: `${career.stressIndex}%` },
    { label: "Mismatch Risk", value: `${career.mismatchProbability}%` },
  ];

  doc.setFontSize(10);
  insights.forEach((insight) => {
    checkPageBreak(10);

    // Background
    doc.setFillColor(245, 250, 255);
    doc.rect(margins.left, yPos - 4.5, contentWidth, 8, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'bold');
    doc.text(insight.label + ":", margins.left + 3, yPos);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(insight.value, pageWidth - margins.right - 20, yPos);

    yPos += 9;
  });

  yPos += 6;

  // Section Divider
  checkPageBreak(15);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margins.left, yPos, pageWidth - margins.right, yPos);
  yPos += 10;

  // Match Breakdown Section
  checkPageBreak(50);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("Your Match Breakdown", margins.left, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;

  const breakdownData = [
    { label: "Personality Match", value: breakdown.personalityMatch },
    { label: "Skills Match", value: breakdown.skillsMatch },
    { label: "Interests Match", value: breakdown.interestsMatch },
  ];

  doc.setFontSize(10);
  breakdownData.forEach((item) => {
    checkPageBreak(12);

    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'bold');
    doc.text(item.label, margins.left + 3, yPos);
    doc.setFont(undefined, 'normal');

    // Background bar
    doc.setFillColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.rect(margins.left + 75, yPos - 3.5, 85, 6, 'F');

    // Filled bar
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    const barWidth = (item.value / 100) * 85;
    doc.rect(margins.left + 75, yPos - 3.5, barWidth, 6, 'F');

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text(`${item.value}%`, pageWidth - margins.right - 12, yPos);
    doc.setFont(undefined, 'normal');

    yPos += 10;
  });

  yPos += 6;

  // Section Divider
  checkPageBreak(15);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margins.left, yPos, pageWidth - margins.right, yPos);
  yPos += 10;

  // Required Skills Section
  checkPageBreak(35);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("Required Skills", margins.left, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;

  doc.setFontSize(9);
  let xPos = margins.left;
  let skillRowHeight = yPos;

  career.requiredSkills.forEach((skill) => {
    const skillWidth = doc.getTextWidth(skill) + 10;

    // Check if skill badge will fit in current row
    if (xPos + skillWidth > pageWidth - margins.right) {
      checkPageBreak(12);
      xPos = margins.left;
      yPos += 8;
      skillRowHeight = yPos;
    }

    // Skill badge
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(xPos, yPos - 4, skillWidth, 7, 1.5, 1.5, 'FD');

    doc.setTextColor(255, 255, 255);
    doc.text(skill, xPos + 5, yPos);

    xPos += skillWidth + 5;
  });

  yPos += 12;

  // Section Divider
  checkPageBreak(15);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margins.left, yPos, pageWidth - margins.right, yPos);
  yPos += 10;

  // Industry Trends Section
  checkPageBreak(30);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("Industry Trends & Outlook", margins.left, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const trendsLines = doc.splitTextToSize(career.industryTrends, contentWidth);
  doc.text(trendsLines, margins.left, yPos);
  yPos += trendsLines.length * 5.5 + 10;

  // Section Divider
  checkPageBreak(15);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margins.left, yPos, pageWidth - margins.right, yPos);
  yPos += 10;

  // Recommended Next Steps Section
  checkPageBreak(40);

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont(undefined, 'bold');
  doc.text("Recommended Next Steps", margins.left, yPos);
  doc.setFont(undefined, 'normal');
  yPos += 10;

  const nextSteps = [
    "Research educational pathways and degree programs for this career",
    "Connect with professionals in this field for informational interviews",
    "Explore internship opportunities to gain hands-on experience",
    "Develop the required skills through online courses or workshops",
    "Join relevant communities and professional associations",
  ];

  doc.setFontSize(10);
  nextSteps.forEach((step, idx) => {
    const stepLines = doc.splitTextToSize(step, contentWidth - 15);
    const stepHeight = stepLines.length * 5.5 + 5;

    checkPageBreak(stepHeight + 3);

    // Number circle
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.circle(margins.left + 4, yPos - 1, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8);
    doc.text(`${idx + 1}`, margins.left + 4, yPos, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(stepLines, margins.left + 12, yPos);
    yPos += stepHeight;
  });

  // Footer on last page
  checkPageBreak(12);
  yPos += 5;

  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margins.left, pageHeight - 12, pageWidth - margins.right, pageHeight - 12);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated by DreamWeave - ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 6, { align: 'center' });

  doc.save(`DreamWeave_${career.title.replace(/\s+/g, '_')}_Report.pdf`);
}
