import { supabase } from './supabaseClient';
import { APR } from '../types';

export const createAPR = async (apr: Omit<APR, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        const { error } = await supabase
            .from('aprs')
            .insert({
                user_id: user.id,
                task_name: apr.taskName,
                location: apr.location,
                description: apr.description,
                date: apr.date,
                status: apr.status,
                risks: apr.risks,
                team_signatures: apr.teamSignatures,
                approver_signature: apr.approverSignature,
                project_id: apr.projectId
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error creating APR:', error);
        return { success: false, error: error.message };
    }
};

export const getAPRs = async (): Promise<APR[]> => {
    try {
        const { data, error } = await supabase
            .from('aprs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            taskName: item.task_name,
            location: item.location,
            description: item.description,
            date: item.date,
            status: item.status,
            risks: item.risks,
            teamSignatures: item.team_signatures,
            approverSignature: item.approver_signature,
            projectId: item.project_id
        }));
    } catch (error) {
        console.error('Error fetching APRs:', error);
        return [];
    }
};

export const getAPRById = async (id: string): Promise<APR | null> => {
    try {
        const { data, error } = await supabase
            .from('aprs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            taskName: data.task_name,
            location: data.location,
            description: data.description,
            date: data.date,
            status: data.status,
            risks: data.risks,
            teamSignatures: data.team_signatures,
            approverSignature: data.approver_signature,
            projectId: data.project_id
        };
    } catch (error) {
        console.error('Error fetching APR:', error);
        return null;
    }
};

export const updateAPR = async (id: string, apr: Partial<APR>): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('aprs')
            .update({
                task_name: apr.taskName,
                location: apr.location,
                description: apr.description,
                date: apr.date,
                status: apr.status,
                risks: apr.risks,
                team_signatures: apr.teamSignatures,
                approver_signature: apr.approverSignature,
                project_id: apr.projectId
            })
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error updating APR:', error);
        return { success: false, error: error.message };
    }
};

export const deleteAPR = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('aprs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting APR:', error);
        return { success: false, error: error.message };
    }
};
