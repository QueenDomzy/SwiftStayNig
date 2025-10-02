import { useEffect, useState } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';

export default function Properties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get('/properties').then(res => setProperties(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}
