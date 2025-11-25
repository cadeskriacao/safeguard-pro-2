
import { supabase } from './supabaseClient';
import { Inspection } from '../types';

export const createInspection = async (inspection: Inspection): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        if (!inspection.projectId) {
            return { success: false, error: 'ID do projeto é obrigatório' };
        }

        // Remove id to let Supabase generate it, or keep it if you want client-side ID generation (not recommended for PKs usually, but matching types)
        // We'll let Supabase generate the ID if we omit it, but our type requires it. 
        // Let's send everything except ID if we want auto-gen, or send ID if we generated it.
        // Given the previous code generated ID with Date.now(), let's stick to Supabase auto-gen for better consistency, 
        // but we need to map the object correctly.

        const { error } = await supabase
            .from('inspections')
            .insert({
                user_id: user.id,
                location: inspection.location,
                date: inspection.date,
                inspector_name: inspection.inspectorName,
                has_imminent_risk: inspection.hasImminentRisk,
                project_id: inspection.projectId,
                signature_url: inspection.signatureUrl,
                items: inspection.items
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error creating inspection:', error);
        return { success: false, error: error.message };
    }
};

export const getInspections = async (): Promise<Inspection[]> => {
    try {
        const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            location: item.location,
            date: item.date,
            inspectorName: item.inspector_name,
            hasImminentRisk: item.has_imminent_risk,
            projectId: item.project_id,
            signatureUrl: item.signature_url,
            items: item.items
        }));
    } catch (error) {
        console.error('Error fetching inspections:', error);
        return [];
    }
};

export const getInspectionById = async (id: string): Promise<Inspection | null> => {
    try {
        const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            location: data.location,
            date: data.date,
            inspectorName: data.inspector_name,
            hasImminentRisk: data.has_imminent_risk,
            projectId: data.project_id,
            signatureUrl: data.signature_url,
            items: data.items
        };
    } catch (error) {
        console.error('Error fetching inspection:', error);
        return null;
    }
};

export const getInspectionsByProjectId = async (projectId: string): Promise<Inspection[]> => {
    try {
        const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            location: item.location,
            date: item.date,
            inspectorName: item.inspector_name,
            hasImminentRisk: item.has_imminent_risk,
            projectId: item.project_id,
            signatureUrl: item.signature_url,
            items: item.items
        }));
    } catch (error) {
        console.error('Error fetching project inspections:', error);
        return [];
    }
};
