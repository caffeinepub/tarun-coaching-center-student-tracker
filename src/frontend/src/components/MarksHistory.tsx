import { useGetMarksByStudent } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarksHistoryProps {
  studentId: bigint | null;
}

function getGrade(score: bigint): { grade: string; color: string } {
  const numScore = Number(score);
  if (numScore >= 90) return { grade: 'A+', color: 'bg-green-600' };
  if (numScore >= 80) return { grade: 'A', color: 'bg-green-500' };
  if (numScore >= 70) return { grade: 'B', color: 'bg-blue-500' };
  if (numScore >= 60) return { grade: 'C', color: 'bg-yellow-500' };
  if (numScore >= 50) return { grade: 'D', color: 'bg-orange-500' };
  return { grade: 'F', color: 'bg-red-500' };
}

function getPerformanceIcon(score: bigint) {
  const numScore = Number(score);
  if (numScore >= 75) return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (numScore >= 50) return <Minus className="w-4 h-4 text-yellow-600" />;
  return <TrendingDown className="w-4 h-4 text-red-600" />;
}

export default function MarksHistory({ studentId }: MarksHistoryProps) {
  const { data: marks, isLoading } = useGetMarksByStudent(studentId);

  if (!studentId) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Select a student to view marks history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading marks...</p>
      </div>
    );
  }

  if (!marks || marks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No marks recorded for this student yet</p>
      </div>
    );
  }

  const groupedBySubject = marks.reduce((acc, mark) => {
    if (!acc[mark.subject]) {
      acc[mark.subject] = [];
    }
    acc[mark.subject].push(mark);
    return acc;
  }, {} as Record<string, typeof marks>);

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {Object.entries(groupedBySubject).map(([subject, subjectMarks]) => (
        <Card key={subject} className="p-4 border-blue-100 dark:border-gray-700">
          <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-3">{subject}</h3>
          <div className="space-y-2">
            {subjectMarks.map((mark, idx) => {
              const { grade, color } = getGrade(mark.score);
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPerformanceIcon(mark.score)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{mark.examType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Score: {mark.score.toString()}/100</p>
                    </div>
                  </div>
                  <Badge className={`${color} text-white font-bold`}>{grade}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
