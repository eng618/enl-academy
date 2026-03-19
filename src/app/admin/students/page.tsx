'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Card, Input, Text } from '@gv-tech/ui-web';
import { useEffect, useState } from 'react';

export default function AdminStudentsPage() {
  const supabase = getBrowserSupabaseClient();

  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [students, setStudents] = useState<Database['public']['Tables']['students']['Row'][]>([]);
  const [householdId, setHouseholdId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setMessage('Please sign in first.');
        setSessionLoaded(true);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profileData) {
        setMessage('Unable to load user profile.');
        setSessionLoaded(true);
        return;
      }

      setProfile(profileData);
      setHouseholdId(profileData.household_id ?? '');

      if (!profileData.household_id) {
        setMessage('No household assigned to your profile.');
        setSessionLoaded(true);
        return;
      }

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('household_id', profileData.household_id)
        .order('created_at', { ascending: true });

      if (studentsError) {
        setMessage(`Unable to load students: ${studentsError.message}`);
        setSessionLoaded(true);
        return;
      }

      setStudents(studentsData ?? []);
      setMessage('');
      setSessionLoaded(true);
    };

    init();
  }, [supabase]);

  const createStudent = async () => {
    if (!householdId || !newStudentName || !newStudentGrade) {
      setMessage('Household, student name, and grade are required.');
      return;
    }

    const { error } = await supabase.from('students').insert({
      household_id: householdId,
      name: newStudentName,
      grade: newStudentGrade,
    });

    if (error) {
      setMessage(`Unable to add student: ${error.message}`);
      return;
    }

    setNewStudentName('');
    setNewStudentGrade('');
    setMessage('Student added successfully.');

    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: true });

    if (!studentsError && studentsData) {
      setStudents(studentsData);
    }
  };

  if (!sessionLoaded) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text>Loading...</Text>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text>{message || 'No profile available.'}</Text>
      </main>
    );
  }

  if (!['admin', 'parent'].includes(profile.role)) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text>You must be an admin or parent to manage students.</Text>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Text as="h1" variant="h3" className="mb-4">
        Student Management
      </Text>

      <Card className="mb-4 p-4">
        <Text variant="h4" className="mb-2">
          Add new student
        </Text>
        <div className="space-y-2">
          <Input
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.currentTarget.value)}
            placeholder="Student name"
          />
          <Input
            value={newStudentGrade}
            onChange={(e) => setNewStudentGrade(e.currentTarget.value)}
            placeholder="Grade"
          />
          <Button onClick={createStudent}>Create student</Button>
        </div>
      </Card>

      <Card className="p-4">
        <Text variant="h4" className="mb-2">
          Household {householdId} students
        </Text>
        {students.length === 0 ? (
          <Text>No students found yet.</Text>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {students.map((student) => (
              <li key={student.id}>
                {student.name} — Grade {student.grade}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {message && <Text className="mt-4">{message}</Text>}
    </main>
  );
}
