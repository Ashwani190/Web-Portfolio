import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

/**
 * Generic hook for fetching data from a Supabase table.
 * 
 * @param {string} table - Table name
 * @param {object} options - Query options
 * @param {string} options.orderBy - Column to order by (default: 'display_order')
 * @param {boolean} options.ascending - Sort order (default: true)
 * @param {string} options.select - Select clause (default: '*')
 * @param {object} options.filters - Key-value filters { column: value }
 * @param {number} options.limit - Limit number of rows
 * @param {boolean} options.single - Return a single row
 */
export const useSupabaseData = (table, options = {}) => {
  const {
    orderBy = 'display_order',
    ascending = true,
    select = '*',
    filters = {},
    limit,
    single = false,
    enabled = true,
  } = options;

  const [data, setData] = useState(single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Single row
      if (single) {
        query = query.single();
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy, ascending, limit, single, enabled, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
};

/**
 * Hook for CRUD operations on a Supabase table (admin use)
 */
export const useSupabaseCRUD = (table) => {
  const [saving, setSaving] = useState(false);

  const create = async (record) => {
    try {
      setSaving(true);
      const { data, error } = await supabase.from(table).insert(record).select().single();
      if (error) throw error;
      toast.success('Created successfully!');
      return data;
    } catch (err) {
      toast.error(err.message || 'Failed to create');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, updates) => {
    try {
      setSaving(true);
      const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
      if (error) throw error;
      toast.success('Updated successfully!');
      return data;
    } catch (err) {
      toast.error(err.message || 'Failed to update');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      setSaving(true);
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateOrder = async (items) => {
    try {
      setSaving(true);
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      
      for (const update of updates) {
        const { error } = await supabase
          .from(table)
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        if (error) throw error;
      }
      toast.success('Order updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update order');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { create, update, remove, updateOrder, saving };
};
