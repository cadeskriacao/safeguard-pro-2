import { Inspection, InspectionItem, Project } from '../types';
import { INITIAL_PROJECTS } from '../constants';

const INSPECTION_KEY = 'safeguard_inspections';
const PROJECTS_KEY = 'safeguard_projects';

// --- INSPECTIONS ---

export const getInspections = (): Inspection[] => {
  try {
    const stored = localStorage.getItem(INSPECTION_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading inspections", error);
    return [];
  }
};

export const getInspectionById = (id: string): Inspection | undefined => {
  const inspections = getInspections();
  return inspections.find(i => i.id === id);
};

export const addInspection = (inspection: Inspection): boolean => {
  try {
    const current = getInspections();
    const updated = [inspection, ...current];
    localStorage.setItem(INSPECTION_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Error saving inspection", error);
    return false;
  }
};

// --- PROJECTS ---

export const getProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (!stored) {
      // Initialize with mock data if empty
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading projects", error);
    return INITIAL_PROJECTS;
  }
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

export const saveProject = (project: Project): boolean => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    let updatedProjects;
    if (index >= 0) {
      // Update existing
      updatedProjects = [...projects];
      updatedProjects[index] = project;
    } else {
      // Create new
      updatedProjects = [project, ...projects];
    }
    
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return true;
  } catch (error) {
    console.error("Error saving project", error);
    return false;
  }
};

export const deleteProject = (id: string): boolean => {
  try {
    const projects = getProjects();
    const updatedProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    return true;
  } catch (error) {
    console.error("Error deleting project", error);
    return false;
  }
};