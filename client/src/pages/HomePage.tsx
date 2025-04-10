import { ComplaintForm } from '../components/complaints/ComplaintForm';
import { MotivationGenerator } from '../components/complaints/MotivationGenerator';
import { useTitle } from '../hooks/use-title';

export default function HomePage() {
  useTitle('Curhat - Ngeluh Dulu, Baru Tenang');
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="sr-only">Ngeluh Dulu, Baru Tenang</h1>
      
      <ComplaintForm />
      
      <div className="mt-8">
        <MotivationGenerator />
      </div>
    </div>
  );
}