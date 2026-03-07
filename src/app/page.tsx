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
    <div className="site-wrap">
      <SiteHeader />

      <main className="site-main">
        <section id="welcome" className="hero-panel border-border/80 overflow-hidden rounded-3xl border p-6 sm:p-10">
          <div className="hero-copy space-y-5">
            <Badge variant="secondary">Homeschooling with Purpose</Badge>
            <Text as="h1" variant="h1" className="font-title leading-tight text-balance">
              Nurturing Hearts and Minds for Christ
            </Text>
            <Text as="p" variant="body" className="text-muted-foreground max-w-2xl">
              Welcome to our family homeschool space. We are building a gentle, gospel-rooted learning life where truth,
              wonder, and discipline grow together over time.
            </Text>
            <div className="hero-actions">
              <Button asChild>
                <a href="#learning">Explore Learning Areas</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#resources">View Resources</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="site-section site-grid-3">
          {values.map((value) => (
            <Card key={value.title} className="site-card">
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section id="faith" className="site-section site-card rounded-2xl border p-6 sm:p-8">
          <Text as="h2" variant="h2" className="font-title">
            Faith Statement
          </Text>
          <Text as="p" variant="body" className="text-muted-foreground mt-4 max-w-3xl">
            We believe all wisdom begins with reverence for God. We teach our children that learning is stewardship,
            truth is found in Christ, and every subject can be explored with gratitude and integrity.
          </Text>
        </section>

        <section id="learning" className="site-section">
          <Text as="h2" variant="h2" className="font-title">
            Learning Areas
          </Text>
          <div className="site-grid-3 mt-5">
            {learningAreas.map((area) => (
              <Card key={area} className="site-card">
                <CardContent className="p-5">
                  <Text variant="label" className="text-foreground">
                    {area}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="rhythm" className="site-section">
          <Text as="h2" variant="h2" className="font-title">
            Weekly Rhythm
          </Text>
          <div className="site-grid-3 mt-5">
            {rhythm.map((period) => (
              <Card key={period.slot} className="site-card">
                <CardHeader>
                  <CardTitle>{period.slot}</CardTitle>
                  <CardDescription>{period.detail}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="resources" className="site-section pb-2">
          <Text as="h2" variant="h2" className="font-title">
            Resources
          </Text>
          <div className="site-grid-3 mt-5">
            {resources.map((resource) => (
              <Card key={resource.title} className="site-card">
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
