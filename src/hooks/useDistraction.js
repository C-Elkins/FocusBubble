// useDistraction Hook
import { useState } from 'react';

export function useDistraction() {
  const [distractions, setDistractions] = useState([]);

  const addDistraction = (distraction) => {
    setDistractions([...distractions, distraction]);
  };

  return { distractions, addDistraction };
}
