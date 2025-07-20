import { useEffect, useState } from 'react';

export const useCommonFoods = () => {
  const [foods, setFoods] = useState<{ label: string }[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem('cachedCommonFoods');

    if (cached) {
      setFoods(JSON.parse(cached));
    } else {
      fetch('/commonFoods.json')
        .then((res) => res.json())
        .then((data: string[]) => {
          const formatted = data.map((name) => ({ label: name }));
          setFoods(formatted);
          localStorage.setItem('cachedCommonFoods', JSON.stringify(formatted));
        });
    }
  }, []);

  return foods;
};
