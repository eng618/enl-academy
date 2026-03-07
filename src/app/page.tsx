import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@gv-tech/ui-web';

import { SiteFooter } from '@/components/site/footer';
import { SiteHeader } from '@/components/site/header';

const values = [
  {
    title: 'Christ-Centered Learning',
    description: 'Scripture frames our studies, character, and conversations each day.',
  },
  {
    title: 'Whole-Person Formation',
    description: 'We cultivate wisdom, discipline, creativity, and compassion together.',
  },
  {
    title: 'Steady Family Rhythm',
    description: 'Simple routines keep our home peaceful, purposeful, and joyful.',
  },
];

const learningAreas = [
  'Bible and Christian worldview',
  'Language arts and storytelling',
  'Mathematics and problem solving',
  'History and civilizations',
  'Science, nature, and discovery',
  'Art, music, and practical life skills',
];

const rhythm = [
  {
    slot: 'Morning',
    detail: 'Devotions, memory verse, and core lessons',
  },
  {
    slot: 'Midday',
    detail: 'Hands-on projects, reading blocks, and exploration',
  },
  {
    slot: 'Afternoon',
    detail: 'Nature walks, creative practice, and reflection',
  },
];

const resources = [
  {
    title: 'Family Reading List',
    description: 'Books we are reading aloud and independently this season.',
    href: '#',
  },
  {
    title: 'Weekly Snapshot',
    description: 'A simple view of the current learning plan and highlights.',
    href: '#',
  },
  {
    title: 'Prayer Requests',
    description: 'Ways friends and family can pray for our homeschool journey.',
    href: '#',
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <section id="welcome" className="hero-panel border-border/80 overflow-hidden rounded-3xl border p-6 sm:p-10">
          <div className="relative z-10 max-w-3xl space-y-5">
            <Badge variant="secondary">Homeschooling with Purpose</Badge>
            <Text as="h1" variant="h1" className="font-title leading-tight text-balance">
              Nurturing Hearts and Minds for Christ
            </Text>
            <Text as="p" variant="body" className="text-muted-foreground max-w-2xl">
              Welcome to our family homeschool space. We are building a gentle, gospel-rooted learning life where truth,
              wonder, and discipline grow together over time.
            </Text>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <a href="#learning">Explore Learning Areas</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#resources">View Resources</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="mt-12 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section id="faith" className="border-border/70 bg-card/90 mt-12 rounded-2xl border p-6 sm:p-8">
          <Text as="h2" variant="h2" className="font-title">
            Faith Statement
          </Text>
          <Text as="p" variant="body" className="text-muted-foreground mt-4 max-w-3xl">
            We believe all wisdom begins with reverence for God. We teach our children that learning is stewardship,
            truth is found in Christ, and every subject can be explored with gratitude and integrity.
          </Text>
        </section>

        <section id="learning" className="mt-12">
          <Text as="h2" variant="h2" className="font-title">
            Learning Areas
          </Text>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {learningAreas.map((area) => (
              <Card key={area} className="border-border/70">
                <CardContent className="p-5">
                  <Text variant="label" className="text-foreground">
                    {area}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="rhythm" className="mt-12">
          <Text as="h2" variant="h2" className="font-title">
            Weekly Rhythm
          </Text>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {rhythm.map((period) => (
              <Card key={period.slot} className="border-border/70 bg-card">
                <CardHeader>
                  <CardTitle>{period.slot}</CardTitle>
                  <CardDescription>{period.detail}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="resources" className="mt-12 pb-2">
          <Text as="h2" variant="h2" className="font-title">
            Resources
          </Text>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.title} className="border-border/70 bg-card/95">
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="secondary" size="sm">
                    <a href={resource.href}>Open</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
