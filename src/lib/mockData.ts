import type { BeltColor } from '@/constants/theme';

export const PHOTOS = {
  gym1: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
  gym2: 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=800&q=80',
  gym3: 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=800&q=80',
  gym4: 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=800&q=80',
  roll1: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=800&q=80',
  roll2: 'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?w=800&q=80',
  roll3: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
  roll4: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&q=80',
  group1: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80',
  group2: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  p1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  p2: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  p3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  p4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  p5: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  p6: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
  p7: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
  p8: 'https://images.unsplash.com/photo-1554384645-13eab165c24b?w=200&q=80',
  p9: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
  p10: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80',
  techVid: 'https://images.unsplash.com/photo-1583500178690-f7eb2dabd9b6?w=800&q=80',
  mat: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80',
};

export type Person = {
  id: string;
  name: string;
  handle: string;
  belt: BeltColor;
  stripes: number;
  avatar: string;
  gym: string;
};

export const ME = {
  name: 'Mateo Vargas',
  handle: 'mateo',
  belt: 'blue' as BeltColor,
  stripes: 2,
  homeGym: 'Atos HQ - San Diego',
  city: 'San Diego, CA',
  avatar: PHOTOS.p4,
  bio: 'Blue belt out of Atos. Travel a lot for work, always looking for a roll. Coffee before, açaí after.',
  stats: { rolls: 312, gymsVisited: 14, openMats: 47, streak: 9 },
};

export const PEOPLE: Person[] = [
  { id: 'sara', name: 'Sara Costa', handle: 'sarac', belt: 'purple', stripes: 1, avatar: PHOTOS.p2, gym: 'Gracie Barra Austin' },
  { id: 'dre', name: 'André Pinto', handle: 'andre.p', belt: 'brown', stripes: 3, avatar: PHOTOS.p3, gym: 'Atos HQ' },
  { id: 'kai', name: 'Kai Nakamura', handle: 'kainak', belt: 'blue', stripes: 4, avatar: PHOTOS.p5, gym: 'Unity Jiu-Jitsu' },
  { id: 'lena', name: 'Lena Park', handle: 'lenap', belt: 'white', stripes: 3, avatar: PHOTOS.p6, gym: '10th Planet HQ' },
  { id: 'marc', name: 'Marc Oliveira', handle: 'marco', belt: 'black', stripes: 1, avatar: PHOTOS.p7, gym: 'Checkmat NYC' },
  { id: 'priya', name: 'Priya Iyer', handle: 'priya', belt: 'blue', stripes: 0, avatar: PHOTOS.p8, gym: 'AOJ' },
  { id: 'tom', name: 'Tom Reyes', handle: 'tomr', belt: 'purple', stripes: 4, avatar: PHOTOS.p9, gym: 'Renzo Gracie' },
  { id: 'jess', name: 'Jess Walker', handle: 'jessw', belt: 'brown', stripes: 1, avatar: PHOTOS.p10, gym: 'Caio Terra HQ' },
];

export type Gym = {
  id: string;
  name: string;
  affiliation: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  dropIn: number;
  cover: string;
  photos: string[];
  headInstructor: string;
  visitors: string;
  style: string[];
  tags: string[];
  members: number;
  openMatsThisWeek: number;
  nextOpenMat: string;
  address: string;
  description: string;
};

export const GYMS: Gym[] = [
  {
    id: 'atos',
    name: 'Atos HQ',
    affiliation: 'Atos Jiu-Jitsu',
    location: 'San Diego, CA',
    distance: '0.8 mi',
    rating: 4.9,
    reviewCount: 287,
    dropIn: 30,
    cover: PHOTOS.gym1,
    photos: [PHOTOS.gym1, PHOTOS.roll1, PHOTOS.group1, PHOTOS.mat],
    headInstructor: 'André Galvão',
    visitors: 'Drop-ins welcome',
    style: ['Gi', 'No-Gi'],
    tags: ['Competition', 'World-class', 'All levels'],
    members: 412,
    openMatsThisWeek: 3,
    nextOpenMat: 'Sat 11:00 AM',
    address: '1153 Garnet Ave, San Diego',
    description: 'World-renowned competition academy founded by André Galvão. Drop-ins welcome from any team, bring proof of belt rank.',
  },
  {
    id: 'gb-austin',
    name: 'Gracie Barra Austin',
    affiliation: 'Gracie Barra',
    location: 'Austin, TX',
    distance: '2.1 mi',
    rating: 4.7,
    reviewCount: 142,
    dropIn: 25,
    cover: PHOTOS.gym2,
    photos: [PHOTOS.gym2, PHOTOS.roll2, PHOTOS.group2],
    headInstructor: 'Prof. Lucas Valle',
    visitors: 'Drop-ins welcome',
    style: ['Gi', 'No-Gi', 'Kids'],
    tags: ['Family-friendly', 'Beginner program'],
    members: 215,
    openMatsThisWeek: 2,
    nextOpenMat: 'Sun 10:00 AM',
    address: '4131 Spicewood Springs Rd',
    description: 'Welcoming Gracie Barra school with strong fundamentals program. Big Sunday open mat, coffee and pão de queijo after.',
  },
  {
    id: 'unity',
    name: 'Unity Jiu-Jitsu',
    affiliation: 'Alliance',
    location: 'New York, NY',
    distance: '0.4 mi',
    rating: 4.8,
    reviewCount: 198,
    dropIn: 40,
    cover: PHOTOS.gym3,
    photos: [PHOTOS.gym3, PHOTOS.roll3],
    headInstructor: 'Murilo Santana',
    visitors: 'Drop-ins by appointment',
    style: ['Gi', 'No-Gi'],
    tags: ['Competition', 'Advanced'],
    members: 320,
    openMatsThisWeek: 1,
    nextOpenMat: 'Sat 12:00 PM',
    address: '37 W 26th St, NY',
    description: "Murilo's competition factory in Manhattan. Wednesday and Saturday open mats, bring it.",
  },
  {
    id: '10p',
    name: '10th Planet HQ',
    affiliation: '10th Planet',
    location: 'Los Angeles, CA',
    distance: '6.7 mi',
    rating: 4.6,
    reviewCount: 167,
    dropIn: 35,
    cover: PHOTOS.gym4,
    photos: [PHOTOS.gym4],
    headInstructor: 'Eddie Bravo',
    visitors: 'Drop-ins welcome',
    style: ['No-Gi'],
    tags: ['No-Gi only', 'Modern grappling'],
    members: 178,
    openMatsThisWeek: 4,
    nextOpenMat: 'Today 7:00 PM',
    address: '920 N Western Ave, LA',
    description: 'No-gi only. Bring shorts and a rashguard. Friday night open mats are legendary.',
  },
  {
    id: 'aoj',
    name: 'AOJ',
    affiliation: 'Art of Jiu-Jitsu',
    location: 'Costa Mesa, CA',
    distance: '78 mi',
    rating: 4.9,
    reviewCount: 312,
    dropIn: 45,
    cover: PHOTOS.roll4,
    photos: [PHOTOS.roll4],
    headInstructor: 'Mendes Bros',
    visitors: 'Drop-ins welcome',
    style: ['Gi', 'No-Gi'],
    tags: ['World-class', 'Technical'],
    members: 480,
    openMatsThisWeek: 2,
    nextOpenMat: 'Sat 11:30 AM',
    address: '2900 Bristol St, Costa Mesa',
    description: "Mendes brothers' temple of technical jiu-jitsu. Reverently quiet rolls. Bring your A-game.",
  },
];

export type OpenMat = {
  id: string;
  gymId: string;
  gym: string;
  city: string;
  title: string;
  day: string;
  date: string;
  time: string;
  style: string;
  level: string;
  dropIn: number;
  going: Person[];
  goingCount: number;
  coverPhoto: string;
  isToday: boolean;
  distance: string;
};

export const OPEN_MATS: OpenMat[] = [
  {
    id: 'om1',
    gymId: 'atos',
    gym: 'Atos HQ',
    city: 'San Diego',
    title: 'Saturday Open Mat',
    day: 'Sat',
    date: 'May 4',
    time: '11:00 AM - 1:00 PM',
    style: 'Gi & No-Gi',
    level: 'All levels',
    dropIn: 30,
    going: [PEOPLE[1], PEOPLE[2], PEOPLE[6], PEOPLE[3]],
    goingCount: 24,
    coverPhoto: PHOTOS.group1,
    isToday: false,
    distance: '0.8 mi',
  },
  {
    id: 'om2',
    gymId: '10p',
    gym: '10th Planet HQ',
    city: 'Los Angeles',
    title: 'Friday Night No-Gi',
    day: 'Today',
    date: 'May 1',
    time: '7:00 PM - 9:00 PM',
    style: 'No-Gi',
    level: 'Blue+',
    dropIn: 35,
    going: [PEOPLE[3], PEOPLE[4]],
    goingCount: 18,
    coverPhoto: PHOTOS.roll4,
    isToday: true,
    distance: '6.7 mi',
  },
  {
    id: 'om3',
    gymId: 'gb-austin',
    gym: 'Gracie Barra Austin',
    city: 'Austin',
    title: 'Sunday Family Open Mat',
    day: 'Sun',
    date: 'May 5',
    time: '10:00 AM - 12:00 PM',
    style: 'Gi',
    level: 'All levels',
    dropIn: 25,
    going: [PEOPLE[0], PEOPLE[5]],
    goingCount: 12,
    coverPhoto: PHOTOS.group2,
    isToday: false,
    distance: '-',
  },
  {
    id: 'om4',
    gymId: 'unity',
    gym: 'Unity Jiu-Jitsu',
    city: 'New York',
    title: 'Saturday Comp Class + Open Mat',
    day: 'Sat',
    date: 'May 4',
    time: '12:00 PM - 2:00 PM',
    style: 'Gi & No-Gi',
    level: 'Purple+',
    dropIn: 40,
    going: [PEOPLE[2], PEOPLE[4], PEOPLE[7]],
    goingCount: 31,
    coverPhoto: PHOTOS.roll3,
    isToday: false,
    distance: '-',
  },
  {
    id: 'om5',
    gymId: 'aoj',
    gym: 'AOJ',
    city: 'Costa Mesa',
    title: 'Saturday Morning Roll',
    day: 'Sat',
    date: 'May 4',
    time: '11:30 AM - 1:00 PM',
    style: 'Gi',
    level: 'All levels',
    dropIn: 45,
    going: [PEOPLE[5]],
    goingCount: 22,
    coverPhoto: PHOTOS.roll4,
    isToday: false,
    distance: '78 mi',
  },
];

export type FeedAuthor =
  | (Person & { isGym?: false })
  | { name: string; handle?: string; avatar: string; isGym: true; belt?: undefined; stripes?: undefined; gym?: string };

export type FeedPost =
  | { id: string; kind: 'open-mat-event'; author: FeedAuthor; time: string; openMat: OpenMat; text: string; likes?: number; comments?: number }
  | { id: string; kind: 'video-share'; author: FeedAuthor; time: string; text: string; video: { thumb: string; duration: string }; likes: number; comments: number; tags: string[] }
  | { id: string; kind: 'gym-checkin'; author: FeedAuthor; time: string; text: string; gym: Gym; photo: string; likes: number; comments: number }
  | { id: string; kind: 'text-post'; author: FeedAuthor; time: string; text: string; likes: number; comments: number };

export const FEED: FeedPost[] = [
  {
    id: 'f1',
    kind: 'open-mat-event',
    author: { name: 'Atos HQ', handle: 'atos', avatar: PHOTOS.gym1, isGym: true },
    time: '2h',
    openMat: OPEN_MATS[0],
    text: 'Bringing back the Saturday roll. Visitors welcome from any team. Coffee on us.',
  },
  {
    id: 'f2',
    kind: 'video-share',
    author: PEOPLE[1],
    time: '4h',
    text: 'Spent 3 weeks drilling this collar drag entry from De La Riva. Finally hit it on a brown belt today.',
    video: { thumb: PHOTOS.techVid, duration: '0:47' },
    likes: 142,
    comments: 23,
    tags: ['de la riva', 'collar drag'],
  },
  {
    id: 'f3',
    kind: 'gym-checkin',
    author: PEOPLE[4],
    time: '6h',
    text: 'First time at Unity. Murilo had us doing leg drags for an hour straight. Bro.',
    gym: GYMS[2],
    photo: PHOTOS.roll3,
    likes: 89,
    comments: 11,
  },
  {
    id: 'f4',
    kind: 'text-post',
    author: PEOPLE[2],
    time: '8h',
    text: "Real talk: getting tapped by white belts on a bad day is part of the journey. The mat doesn't lie. Keep showing up.",
    likes: 234,
    comments: 47,
  },
  {
    id: 'f5',
    kind: 'gym-checkin',
    author: PEOPLE[0],
    time: '1d',
    text: "Drop-in at Gracie Barra Austin. Lucas runs a tight ship, the fundamentals class was *chef's kiss*.",
    gym: GYMS[1],
    photo: PHOTOS.group2,
    likes: 67,
    comments: 8,
  },
];

export type MessageThread = {
  id: string;
  name: string;
  avatar: string;
  belt?: BeltColor;
  stripes?: number;
  isGym?: boolean;
  last: string;
  time: string;
  unread: number;
  online: boolean;
};

export const MESSAGES: MessageThread[] = [
  { id: 'm1', name: 'André Pinto', avatar: PHOTOS.p3, belt: 'brown', stripes: 3, last: "Yeah pull up Saturday. I'll text you the gate code", time: '11:42 AM', unread: 0, online: true },
  { id: 'm2', name: 'Sara Costa', avatar: PHOTOS.p2, belt: 'purple', stripes: 1, last: 'You: nice roll today', time: '9:15 AM', unread: 0, online: false },
  { id: 'm3', name: 'Kai Nakamura', avatar: PHOTOS.p5, belt: 'blue', stripes: 4, last: 'visiting NYC next week, Unity open mat?', time: 'Yesterday', unread: 2, online: false },
  { id: 'm4', name: 'Atos HQ', avatar: PHOTOS.gym1, isGym: true, last: 'Welcome to Atos! Your drop-in is confirmed for Saturday.', time: 'Yesterday', unread: 1, online: false },
  { id: 'm5', name: 'Lena Park', avatar: PHOTOS.p6, belt: 'white', stripes: 3, last: 'tysm for the tip on the cross collar', time: 'Tue', unread: 0, online: false },
  { id: 'm6', name: 'Marc Oliveira', avatar: PHOTOS.p7, belt: 'black', stripes: 1, last: 'see you Saturday brother', time: 'Mon', unread: 0, online: true },
];

export const CHAT_THREAD = [
  { from: 'them' as const, text: 'yo are you going to atos saturday open mat?', time: '11:30 AM' },
  { from: 'me' as const, text: 'planning on it. you in?', time: '11:34 AM' },
  { from: 'them' as const, text: 'fasho. i havent rolled in a week, my body is mad at me lol', time: '11:35 AM' },
  { from: 'me' as const, text: 'haha same. coffee before?', time: '11:40 AM' },
  { from: 'them' as const, text: "Yeah pull up Saturday. I'll text you the gate code", time: '11:42 AM' },
];
