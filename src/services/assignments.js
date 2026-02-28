// Assignments service — CRUD operations for homework assignments
import { supabase } from './supabase.js';

/**
 * Взема всички задачи (сортирани по дата, най-нови първи)
 * @returns {Promise<{data, error}>}
 */
export async function getAssignments() {
  const { data, error } = await supabase
    .from('assignments')
    .select('*, profiles!created_by(full_name)')
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Взема една задача по ID
 * @param {string} id
 * @returns {Promise<{data, error}>}
 */
export async function getAssignment(id) {
  const { data, error } = await supabase
    .from('assignments')
    .select('*, profiles!created_by(full_name)')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Създава нова задача (само за admin)
 * @param {{ title: string, description: string, due_date?: string }} assignment
 * @param {string} createdBy - user ID
 * @returns {Promise<{data, error}>}
 */
export async function createAssignment(assignment, createdBy) {
  const { data, error } = await supabase
    .from('assignments')
    .insert({ ...assignment, created_by: createdBy })
    .select()
    .single();

  return { data, error };
}

/**
 * Обновява задача (само за admin)
 * @param {string} id
 * @param {{ title?: string, description?: string, due_date?: string }} updates
 * @returns {Promise<{data, error}>}
 */
export async function updateAssignment(id, updates) {
  const { data, error } = await supabase
    .from('assignments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Изтрива задача (само за admin)
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteAssignment(id) {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id);

  return { error };
}
