'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/supabase-types';
import { Button, Card, Input, Select, Text } from '@gv-tech/ui-web';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function PlannerPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [students, setStudents] = useState<Database['public']['Tables']['students']['Row'][]>([]);
  const [blackoutDates, setBlackoutDates] = useState<Database['public']['Tables']['blackout_dates']['Row'][]>([]);
  const [curriculums, setCurriculums] = useState<Database['public']['Tables']['curriculums']['Row'][]>([]);
  const [tasks, setTasks] = useState<Database['public']['Tables']['tasks']['Row'][]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [newBlackoutLabel, setNewBlackoutLabel] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStudentId, setNewTaskStudentId] = useState('');

  const supabase = getBrowserSupabaseClient();

  const loadPlanner = async (sessionToUse: Session) => {
    setIsLoading(true);
    const userId = sessionToUse.user.id;

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profileData) {
      setMessage('Unable to load profile. Make sure your account is linked.');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setProfile(profileData);

    const householdId = profileData.household_id;
    if (!householdId) {
      setMessage('Profile has no household assigned. Admin must invite with household_id.');
      setIsLoading(false);
      return;
    }

    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: true });

    if (studentsError) {
      setMessage(`Error loading students: ${studentsError.message}`);
      setIsLoading(false);
      return;
    }

    setStudents(studentsData ?? []);

    const studentIds = (studentsData ?? []).map((student) => student.id);

    if (!studentIds.length) {
      setMessage('No students found in this household. Add students via admin UI.');
      setIsLoading(false);
      return;
    }

    if (!selectedStudentId) {
      const defaultStudent =
        profileData.role === 'student'
          ? studentsData?.find((s) =>
              s.name.toLowerCase().includes(sessionToUse.user.email?.split('@')[0]?.toLowerCase() || ''),
            )
          : studentsData?.[0];
      setSelectedStudentId(defaultStudent?.id ?? studentsData?.[0]?.id ?? '');
      setNewTaskStudentId(defaultStudent?.id ?? studentsData?.[0]?.id ?? '');
    }

    const { data: blackoutData } = await supabase
      .from('blackout_dates')
      .select('*')
      .eq('household_id', householdId)
      .order('date', { ascending: true });

    setBlackoutDates(blackoutData ?? []);

    const { data: curriculaData } = await supabase
      .from('curriculums')
      .select('*')
      .in('student_id', studentIds)
      .order('start_date', { ascending: true });

    setCurriculums(curriculaData ?? []);

    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .in('student_id', studentIds)
      .order('due_date', { ascending: true });

    setTasks(tasksData ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(sessionData.session);
      await loadPlanner(sessionData.session);

      const { data: onAuthData } = supabase.auth.onAuthStateChange((_event, nxtSession) => {
        setSession(nxtSession);
        if (nxtSession) {
          loadPlanner(nxtSession);
        }
      });

      subscription = onAuthData.subscription;
    };

    init();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const sendMagicLink = async () => {
    if (!authEmail) {
      setMessage('Email is required to sign in with magic link.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email: authEmail });
    if (error) {
      setMessage(`Failed to request magic link: ${error.message}`);
    } else {
      setMessage('Magic link sent. Check your email.');
    }
  };

  const signInWithPassword = async () => {
    if (!authEmail || !authPassword) {
      setMessage('Email and password are required.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setMessage(`Password sign-in failed: ${error.message}`);
    } else {
      setMessage('Signed in.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const refresh = async () => {
    if (!session) {
      return;
    }
    await loadPlanner(session);
  };

  const addBlackout = async () => {
    if (!newBlackoutDate || !newBlackoutLabel || !profile?.household_id) {
      setMessage('Date, label and household must be set');
      return;
    }

    const { error } = await supabase.from('blackout_dates').insert({
      household_id: profile.household_id,
      date: newBlackoutDate,
      label: newBlackoutLabel,
    });

    if (error) {
      setMessage(`Add blackout date failed: ${error.message}`);
      return;
    }

    setNewBlackoutDate('');
    setNewBlackoutLabel('');
    setMessage('Blackout date added');
    await refresh();
  };

  const addTask = async () => {
    if (!newTaskTitle || !newTaskDueDate || !newTaskStudentId) {
      setMessage('Task title, due date, and student required');
      return;
    }

    const { error } = await supabase.from('tasks').insert({
      student_id: newTaskStudentId,
      title: newTaskTitle,
      due_date: newTaskDueDate,
      completed: false,
    });

    if (error) {
      setMessage(`Add task failed: ${error.message}`);
      return;
    }

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setMessage('Task added');
    await refresh();
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase.from('tasks').update({ completed: !completed }).eq('id', taskId);

    if (error) {
      setMessage(`Toggle task failed: ${error.message}`);
      return;
    }

    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task)));
  };

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text as="h1" variant="h3" className="mb-4">
          Homeschool Planner
        </Text>
        <Text className="mb-4">Sign in to access your combined calendar, blackout dates, and task planner.</Text>

        <div className="spac mb-4">
          <Input
            value={authEmail}
            onChange={(e) => setAuthEmail(e.currentTarget.value)}
            placeholder="Email"
            type="email"
          />
          <Input
            value={authPassword}
            onChange={(e) => setAuthPassword(e.currentTarget.value)}
            placeholder="Password"
            type="password"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={signInWithPassword}>Sign in with password</Button>
          <Button variant="secondary" onClick={sendMagicLink}>
            Send magic link
          </Button>
        </div>

        {message && <p className="text-foreground/70 mt-3 text-sm">{message}</p>}
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Text>Loading planner data... please wait.</Text>
      </main>
    );
  }

  const visibleStudents = profile?.role === 'student' ? students.filter((s) => s.id === selectedStudentId) : students;
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const combinedCalendar = curriculums.map((curr) => {
    const student = students.find((s) => s.id === curr.student_id);
    return {
      ...curr,
      studentName: student?.name ?? 'Unknown',
    };
  });

  const studentTasks = tasks.filter((task) => task.student_id === selectedStudentId);
  const studentCurriculums = curriculums.filter((c) => c.student_id === selectedStudentId);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" variant="h3">
          Homeschool Planner
        </Text>
        <Button onClick={handleSignOut}>Sign out</Button>
      </div>

      <Text className="mb-2">
        Signed in as {session.user.email ?? 'unknown'} ({profile?.role ?? 'unlinked'})
      </Text>
      <Text className="mb-4">Household ID: {profile?.household_id ?? 'none'}</Text>

      <Card className="mb-4 p-4">
        <Text variant="h4" className="mb-2">
          Households & students
        </Text>
        <div className="mb-3">
          {profile?.role !== 'student' && (
            <>
              <label className="mb-1 block text-sm">Select student for personal view</label>
              <Select value={selectedStudentId} onValueChange={(v) => setSelectedStudentId(v)}>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.grade})
                  </option>
                ))}
              </Select>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Blackout dates
          </Text>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {blackoutDates.length === 0 && <li>No blackout dates scheduled.</li>}
            {blackoutDates.map((date) => (
              <li key={date.id}>
                {date.date}: {date.label}
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2">
            <Input
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.currentTarget.value)}
              placeholder="Date"
            />
            <Input
              value={newBlackoutLabel}
              onChange={(e) => setNewBlackoutLabel(e.currentTarget.value)}
              placeholder="Label"
            />
            <Button onClick={addBlackout}>Add blackout</Button>
          </div>
        </Card>

        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Combined curriculum (household)
          </Text>
          {combinedCalendar.length === 0 ? (
            <Text>No curriculum configured yet.</Text>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {combinedCalendar.map((curr) => (
                <li key={curr.id}>
                  <strong>{curr.studentName}</strong>: {curr.title} ({curr.start_date} → {curr.end_date})
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <Text variant="h4" className="mb-2">
            Daily planner (selected student)
          </Text>
          <Text className="mb-2 text-xs">
            {selectedStudent ? `${selectedStudent.name} (${selectedStudent.grade})` : 'No student selected'}
          </Text>
          <div className="space-y-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.currentTarget.value)}
              placeholder="New task title"
            />
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.currentTarget.value)}
              placeholder="Due date"
            />
            <Select value={newTaskStudentId} onValueChange={(value) => setNewTaskStudentId(value)}>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </Select>
            <Button onClick={addTask}>Add task</Button>
          </div>

          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {studentTasks.length === 0 && <li>No tasks for this student.</li>}
            {studentTasks.map((task) => (
              <li key={task.id}>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                  />
                  <span className={task.completed ? 'text-foreground/70 line-through' : ''}>
                    {task.due_date} – {task.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Text className="text-foreground/70 text-sm">{message}</Text>
      </div>
    </main>
  );
}
