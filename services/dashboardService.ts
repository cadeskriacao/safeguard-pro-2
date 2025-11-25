import { supabase } from './supabaseClient';
import { APRStatus } from '../types';

export interface DashboardStats {
    totalInspections: number;
    activeAPRs: number;
    imminentRisks: number;
    complianceRate: number;
    aprChartData: { name: string; aprs: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        // 1. Get Total Inspections
        const { count: totalInspections, error: inspectionsError } = await supabase
            .from('inspections')
            .select('*', { count: 'exact', head: true });

        if (inspectionsError) throw inspectionsError;

        // 2. Get Active APRs (Pending or Approved)
        const { count: activeAPRs, error: aprsError } = await supabase
            .from('aprs')
            .select('*', { count: 'exact', head: true })
            .in('status', [APRStatus.PENDING_APPROVAL, APRStatus.APPROVED]);

        if (aprsError) throw aprsError;

        // 3. Get Imminent Risks
        const { count: imminentRisks, error: risksError } = await supabase
            .from('inspections')
            .select('*', { count: 'exact', head: true })
            .eq('has_imminent_risk', true);

        if (risksError) throw risksError;

        // 4. Calculate Compliance Rate (Simplified: based on last 100 inspections items)
        // Fetching all items might be too heavy, so let's fetch a sample or aggregate if possible.
        // For now, let's fetch the last 50 inspections and their items to calculate an average.
        const { data: inspectionsData, error: complianceError } = await supabase
            .from('inspections')
            .select('items')
            .order('date', { ascending: false })
            .limit(50);

        if (complianceError) throw complianceError;

        let totalItems = 0;
        let compliantItems = 0;

        inspectionsData?.forEach((inspection: any) => {
            if (inspection.items && Array.isArray(inspection.items)) {
                inspection.items.forEach((item: any) => {
                    if (item.status === 'C' || item.status === 'NC') {
                        totalItems++;
                        if (item.status === 'C') {
                            compliantItems++;
                        }
                    }
                });
            }
        });

        const complianceRate = totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 100;

        // 5. APR Chart Data (Last 7 days)
        const today = new Date();
        const last7Days = new Array(7).fill(0).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        const { data: aprsData, error: chartError } = await supabase
            .from('aprs')
            .select('date')
            .gte('date', last7Days[0].toISOString());

        if (chartError) throw chartError;

        const aprChartData = last7Days.map(date => {
            const dayStr = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '');
            const count = aprsData?.filter((a: any) => {
                const aDate = new Date(a.date);
                return aDate.getDate() === date.getDate() && aDate.getMonth() === date.getMonth();
            }).length || 0;
            return { name: dayStr[0], aprs: count }; // Using first letter for chart
        });

        return {
            totalInspections: totalInspections || 0,
            activeAPRs: activeAPRs || 0,
            imminentRisks: imminentRisks || 0,
            complianceRate,
            aprChartData
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalInspections: 0,
            activeAPRs: 0,
            imminentRisks: 0,
            complianceRate: 0,
            aprChartData: []
        };
    }
};
