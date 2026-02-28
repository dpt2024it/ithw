// Discussions service — форум/канал за помощ към задачите
import { supabase } from './supabase.js';

/**
 * Взема всички дискусии за дадена задача
 * @param {string} assignmentId
 * @returns {Promise<{data, error}>}
 */
export async function getDiscussionsByAssignment(assignmentId) {
  const { data, error } = await supabase
    .from('discussions')
    .select('*, profiles!author_id(full_name, avatar_url)')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Взема една дискусия с всичките ѝ отговори
 * @param {string} discussionId
 * @returns {Promise<{discussion, replies, error}>}
 */
export async function getDiscussionWithReplies(discussionId) {
  const [discResult, repliesResult] = await Promise.all([
    supabase
      .from('discussions')
      .select('*, profiles!author_id(full_name, avatar_url)')
      .eq('id', discussionId)
      .single(),
    supabase
      .from('discussion_replies')
      .select('*, profiles!author_id(full_name, avatar_url)')
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true }),
  ]);

  return {
    discussion: discResult.data,
    replies: repliesResult.data,
    error: discResult.error || repliesResult.error,
  };
}

/**
 * Създава нова дискусия
 * @param {{ assignment_id: string, title: string, body: string }} discussion
 * @param {string} authorId
 * @returns {Promise<{data, error}>}
 */
export async function createDiscussion(discussion, authorId) {
  const { data, error } = await supabase
    .from('discussions')
    .insert({ ...discussion, author_id: authorId })
    .select()
    .single();

  return { data, error };
}

/**
 * Изтрива дискусия
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteDiscussion(id) {
  const { error } = await supabase
    .from('discussions')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * Добавя отговор към дискусия
 * @param {{ discussion_id: string, body: string }} reply
 * @param {string} authorId
 * @returns {Promise<{data, error}>}
 */
export async function createReply(reply, authorId) {
  const { data, error } = await supabase
    .from('discussion_replies')
    .insert({ ...reply, author_id: authorId })
    .select('*, profiles!author_id(full_name, avatar_url)')
    .single();

  return { data, error };
}

/**
 * Изтрива отговор
 * @param {string} id
 * @returns {Promise<{error}>}
 */
export async function deleteReply(id) {
  const { error } = await supabase
    .from('discussion_replies')
    .delete()
    .eq('id', id);

  return { error };
}
