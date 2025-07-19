import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CaregiverDashboard from '@/components/CaregiverDashboard';
import PINEntry from '@/components/PINEntry';

export default function CaregiverPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('caregiver-auth')?.value === 'true';
  
  if (!isAuthenticated) {
    return <PINEntry />;
  }
  
  return <CaregiverDashboard />;
} 