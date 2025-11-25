import { supabase } from './supabaseClient';
import { Project } from '../types';

export const createProject = async (project: Omit<Project, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        const { error } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name: project.name,
                address: project.address,
                status: project.status,
                safety_score: project.safetyScore,
                progress: project.progress,
                manager: project.manager
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error creating project:', error);
        return { success: false, error: error.message };
    }
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('projects')
            .update({
                name: project.name,
                address: project.address,
                status: project.status,
                safety_score: project.safetyScore,
                progress: project.progress,
                manager: project.manager
            })
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
    }
};

export const getProjects = async (): Promise<Project[]> => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            address: item.address,
            status: item.status,
            safetyScore: item.safety_score,
            progress: item.progress,
            manager: item.manager
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            address: data.address,
            status: data.status,
            safetyScore: data.safety_score,
            progress: data.progress,
            manager: data.manager
        };
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
};

export const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
    }
};
