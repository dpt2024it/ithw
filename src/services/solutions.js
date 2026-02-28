// Solutions service — CRUD for student solutions
import { supabase } from './supabase.js';

/**
 * Взема всички решения за дадена задача
 * @param {string} assignmentId
 * @returns {Promise<{data, error}>}
 */
export async function getSolutionsByAssignment(assignmentId) {
  const { data, error } = await supabase
    .from('solutions')
    .select('*, profiles!author_id(full_name, avatar_url)')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: true });

  return { data, error };
}

/**
 * Взема едно решение по ID
 * @param {string} id
 * @returns {Promise<{data, error}>}
 */
export async function getSolution(id) {
  const { data, error } = await supabase
    .from('solutions')
    .select('*, profiles!author_id(full_name, avatar_url), assignments!assignment_id(title)')
    .eq('id', id)
    .single();

  return { data, error };
}

/**
 * Създава ново решение
 * @param {{ assignment_id: string, code: string, notes?: string }} solution
 * @param {string} authorId
 * @returns {Promise<{data, error}>}
 */
export async function createSolution(solution, authorId) {
  const { data, error } = await supabase
    .from('solutions')
    .insert({ ...solution, author_id: authorId })
    .select()
    .single();

  return { data, error };
}

/**
 * Обновява решение
 * @param {string} id
 * @param {{ code?: string, notes?: string, file_url?: string }} updates
 * @returns {Promise<{data, error}>}
 */
export async function updateSolution(id, updates) {
  const { data, error } = await supabase
    .from('solutions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Изтрива решение
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteSolution(id) {
  const { error } = await supabase
    .from('solutions')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * Качва файл към решение в Supabase Storage
 * @param {File} file
 * @param {string} userId
 * @param {string} assignmentId
 * @returns {Promise<{url: string | null, error}>}
 */
export async function uploadSolutionFile(file, userId, assignmentId) {
  const filePath = `${userId}/${assignmentId}/${file.name}`;

  const { error } = await supabase.storage
    .from('solution-files')
    .upload(filePath, file, { upsert: true });

  if (error) return { url: null, error };

  const { data } = supabase.storage
    .from('solution-files')
    .getPublicUrl(filePath);

  return { url: data.publicUrl, error: null };
}
