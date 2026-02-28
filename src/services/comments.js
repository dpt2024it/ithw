// Comments service — коментари към решенията (с threading)
import { supabase } from './supabase.js';

/**
 * Взема всички коментари за дадено решение (с автор)
 * @param {string} solutionId
 * @returns {Promise<{data, error}>}
 */
export async function getCommentsBySolution(solutionId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles!author_id(full_name, avatar_url)')
    .eq('solution_id', solutionId)
    .order('created_at', { ascending: true });

  return { data, error };
}

/**
 * Създава нов коментар
 * @param {{ solution_id: string, body: string, parent_id?: string }} comment
 * @param {string} authorId
 * @returns {Promise<{data, error}>}
 */
export async function createComment(comment, authorId) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ ...comment, author_id: authorId })
    .select('*, profiles!author_id(full_name, avatar_url)')
    .single();

  return { data, error };
}

/**
 * Изтрива коментар
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteComment(id) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * Организира flat коментари в дървовидна структура
 * @param {Array} comments
 * @returns {Array} - top-level коментари с вложено поле `replies`
 */
export function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}
