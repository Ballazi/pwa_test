import { useState, useEffect } from 'react';
import instance from '../api';

export function useLicenseData() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let url = '/master/license/';
        const response = await instance.get(url);
        if (response.data.data.length === 0) {
          setData([]);
        } else {
          setData({ data: response.data, type: 'response' });
        }
      } catch (err) {
        setError({ data: err.response.data, type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, error, loading };
}
