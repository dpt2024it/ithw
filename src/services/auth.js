// Authentication service — register, login, logout, session management
import { supabase } from './supabase.js';

/**
 * Регистрация на нов потребител
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<{data, error}>}
 */
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  return { data, error };
}

/**
 * Вход с email и парола
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data, error}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Изход от системата
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Връща текущия потребител (или null)
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Връща профила на текущия потребител (с role)
 * @returns {Promise<{profile, error}>}
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return { profile: null, error: null };

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { profile, error };
}

/**
 * Слуша за промени в auth състоянието
 * @param {function} callback
 * @returns {import('@supabase/supabase-js').Subscription}
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => callback(event, session)
  );
  return subscription;
}
