import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ReportViewer from '@/components/ReportViewer';
import { ConversionReport } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Database, History as HistoryIcon, HelpCircle, Home } from 'lucide-react';
import UserDropdown from '@/components/UserDropdown';
import Help from '@/components/Help';
import { ChatbotToggle } from '@/components/ChatbotToggle';
import { useAuth } from '@/hooks/useAuth';

const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [report, setReport] = useState<ConversionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const lastBackState = React.useRef<any>(null);

  // On mount, if location.state?.backToResults exists, store it
  useEffect(() => {
    if (location.state?.backToResults) {
      lastBackState.current = location.state.backToResults;
    }
  }, [location.state]);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('migration_reports')
          .select('report')
          .eq('id', reportId)
          .single();
        if (error) throw error;
        let loadedReport = data.report as ConversionReport;
        function mapPerformanceMetrics(metrics: any) {
          if (!metrics) return {};
          return {
            performanceScore: metrics.score,
            maintainabilityIndex: metrics.maintainability,
            originalComplexity: metrics.orig_complexity,
            convertedComplexity: metrics.conv_complexity,
            improvementPercentage: metrics.improvement,
            linesReduced: metrics.lines_reduced,
            loopsReduced: metrics.loops_reduced,
            conversionTimeMs: metrics.time_ms,
            // Add more mappings as needed
          };
        }
        if (loadedReport && loadedReport.results) {
          loadedReport.results = loadedReport.results.map((result: any) => ({
            ...result,
            performance: result.performance || mapPerformanceMetrics(result.performance_metrics),
          }));
        }
        setReport(loadedReport);
      } catch (err: any) {
        setError('Failed to fetch report.');
      } finally {
        setLoading(false);
      }
    };
    if (reportId) fetchReport();
  }, [reportId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading report...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!report) {
    return <div className="min-h-screen flex items-center justify-center">Report not found.</div>;
  }

  // Always use the lastBackState if available, otherwise default
  const handleBackToResults = () => {
    const state = lastBackState.current || { activeTab: 'devReview', recentReport: report };
    navigate('/migration', { state });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
                <Home className="h-4 w-4" />
                Home
              </button>
              <div className="flex items-center">
                <Database className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Migration Report</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user && <ChatbotToggle variant="header" isVisible={true} isCollapsed={false} />}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/history', { state: { previousReportId: reportId, backToResults: lastBackState.current || { activeTab: 'conversion', recentReport: report } } })}
                className="flex items-center gap-2"
              >
                <HistoryIcon className="h-4 w-4" />
                History
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ReportViewer 
          report={report} 
          onBack={handleBackToResults} 
        />
      </main>
      {showHelp && <Help onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default ReportPage; 