import { IEvent } from "@/lib/types";

export const mockEvents: IEvent[] = [
  {
    title: "Tech Innovators Conference 2025",
    description:
      "A gathering of top engineers, entrepreneurs, and investors exploring emerging technologies and startup trends.",
    dateStart: new Date("2025-11-12T09:00:00"),
    dateEnd: new Date("2025-11-14T17:00:00"),
    location: {
      street: "123 Market St",
      city: "San Francisco",
      state: "CA",
      zip: 94103,
      country: "USA",
    },
    id: "tech-innovators-2025",
    src: "/placeholder.jpg",
    isFeatured: true,
  },
  {
    title: "AI & Machine Learning Summit",
    description:
      "Dive into the latest breakthroughs in artificial intelligence, large language models, and robotics with hands-on workshops.",
    dateStart: new Date("2025-12-05T10:00:00"),
    // no dateEnd
    location: {
      street: "500 Madison Ave",
      city: "New York",
      state: "NY",
      zip: 10022,
      country: "USA",
    },
    id: "ai-ml-summit-2025",
    src: "/placeholder.jpg",
    isFeatured: false,
  },
  {
    title: "Frontend Developers Meetup",
    description:
      "A community meetup for frontend engineers to share new tools, techniques, and UI trends for 2026.",
    dateStart: new Date("2026-01-15T18:00:00"),
    dateEnd: new Date("2026-01-15T21:00:00"),
    location: {
      street: "200 Congress Ave",
      city: "Austin",
      state: "TX",
      zip: 73301,
      country: "USA",
    },
    id: "frontend-meetup-2026",
    src: "/placeholder.jpg",
    isFeatured: false,
  },
  {
    title: "Cybersecurity Awareness Expo",
    description:
      "Experts discuss the latest strategies in data protection, ethical hacking, and secure software development.",
    dateStart: new Date("2025-10-28T09:30:00"),
    dateEnd: new Date("2025-10-29T17:00:00"),
    location: {
      street: "78 Lakeside Blvd",
      city: "Chicago",
      state: "IL",
      zip: 60601,
      country: "USA",
    },
    id: "cybersecurity-expo-2025",
    src: "/placeholder.jpg",
    isFeatured: false,
  },
  {
    title: "Cloud Computing World Congress",
    description:
      "Join professionals in cloud architecture and DevOps to explore distributed computing, microservices, and cloud security.",
    dateStart: new Date("2026-02-20T09:00:00"),
    // no dateEnd
    location: {
      street: "2450 Harbor Dr",
      city: "San Diego",
      state: "CA",
      zip: 92101,
      country: "USA",
    },
    id: "cloud-world-2026",
    src: "/placeholder.jpg",
    isFeatured: true,
  },
  {
    title: "Open Source Dev Festival",
    description:
      "Celebrate open-source innovation with talks from core maintainers, project showcases, and live coding sessions.",
    dateStart: new Date("2026-03-10T10:00:00"),
    dateEnd: new Date("2026-03-12T18:00:00"),
    location: {
      street: "99 King St",
      city: "Seattle",
      state: "WA",
      zip: 98101,
      country: "USA",
    },
    id: "open-source-fest-2026",
    src: "/placeholder.jpg",
    isFeatured: false,
  },
  {
    title: "Game Developers Conference Europe",
    description:
      "Workshops, showcases, and panels covering game engines, design, AI behavior systems, and industry trends.",
    dateStart: new Date("2026-04-05T09:00:00"),
    dateEnd: new Date("2026-04-09T17:00:00"),
    location: {
      street: "1 Messeplatz",
      city: "Cologne",
      state: "NRW",
      zip: 50679,
      country: "Germany",
    },
    id: "gdc-europe-2026",
    src: "/placeholder.jpg",
    isFeatured: true,
  },
  {
    title: "Next.js Developer Days",
    description:
      "Learn about the newest features in React and Next.js 19+ from the Vercel engineering team and community experts.",
    dateStart: new Date("2026-05-18T09:00:00"),
    // no dateEnd
    location: {
      street: "100 Main St",
      city: "San Francisco",
      state: "CA",
      zip: 94105,
      country: "USA",
    },
    id: "nextjs-dev-days-2026",
    src: "/placeholder.jpg",
    isFeatured: true,
  },
];
