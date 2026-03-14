import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Text,
} from '@gv-tech/ui-web';

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

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <Text variant="overline">{eyebrow}</Text>
      <Text as="h2" variant="h2" className="font-title">
        {title}
      </Text>
      <Text as="p" variant="body">
        {description}
      </Text>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <Text as="h2" variant="h2">
      {title}
    </Text>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Text variant="bodySmall" className="text-muted-foreground">
          More details coming soon.
        </Text>
      </CardContent>
    </Card>
  );
}

function LabelCard({ label }: { label: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text variant="bodySmall" className="text-muted-foreground">
          A core focus area that guides our weekly rhythm.
        </Text>
      </CardContent>
    </Card>
  );
}

export function HeroSection() {
  return (
    <section id="welcome" className="py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-center">
        <div className="space-y-6">
          <Badge>Homeschooling with Purpose</Badge>
          <Text as="h1" variant="h1" className="font-title">
            Nurturing Hearts and Minds for Christ
          </Text>
          <Text as="p" variant="body">
            Welcome to our family homeschool space. We are building a gentle, gospel-rooted learning life where truth,
            wonder, and discipline grow together over time.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <a href="#learning">Explore Learning Areas</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#resources">View Resources</a>
            </Button>
          </div>
        </div>

        <div className="hidden gap-6 lg:grid">
          {values.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValueGrid() {
  return (
    <section id="about" className="py-20">
      <SectionIntro
        eyebrow="Foundations"
        title="A steady learning life built around conviction, craft, and joy."
        description="These are the habits and values that shape the tone of our homeschool from one week to the next."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {values.map((value) => (
          <InfoCard key={value.title} title={value.title} description={value.description} />
        ))}
      </div>
    </section>
  );
}

export function FaithStatement() {
  return (
    <section id="faith" className="py-20">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <Text variant="overline">Faith</Text>
          <CardTitle>Faith Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Text as="p" variant="body">
            We believe all wisdom begins with reverence for God. We teach our children that learning is stewardship,
            truth is found in Christ, and every subject can be explored with gratitude and integrity.
          </Text>
        </CardContent>
      </Card>
    </section>
  );
}

export function LearningAreasSection() {
  return (
    <section id="learning" className="py-20">
      <SectionIntro
        eyebrow="Studies"
        title="Learning areas we return to each week."
        description="We keep a broad course of study, but move through it with a gentle pace and consistent attention."
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {learningAreas.map((area) => (
          <LabelCard key={area} label={area} />
        ))}
      </div>
    </section>
  );
}

export function RhythmSection() {
  return (
    <section id="rhythm" className="py-20">
      <SectionIntro
        eyebrow="Cadence"
        title="A simple weekly rhythm that keeps the day peaceful."
        description="We use a steady shape for our days so academics, imagination, and rest all have room to breathe."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {rhythm.map((period) => (
          <InfoCard key={period.slot} title={period.slot} description={period.detail} />
        ))}
      </div>
    </section>
  );
}

export function ResourcesSection() {
  return (
    <section id="resources" className="py-20">
      <SectionIntro
        eyebrow="Resources"
        title="Helpful touchpoints for family, friends, and weekly planning."
        description="A few simple links keep our current books, plans, and prayer needs easy to share."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="secondary" size="sm">
                <a href={resource.href}>Open</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
