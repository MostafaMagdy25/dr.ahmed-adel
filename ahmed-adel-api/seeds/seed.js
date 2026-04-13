/**
 * Database Seeder
 * ---------------
 * Populates the database with default data from the frontend SiteContext defaults.
 * Idempotent — only seeds collections that are empty.
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Contact = require('../models/Contact');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const SiteSettings = require('../models/SiteSettings');

// ─── Default Data (mirrored from frontend SiteContext.tsx) ──────────────────

const defaultHero = {
  tagline: 'MBBCh Candidate',
  headline: 'Dedicated to compassionate care',
  description:
    "Hello, I'm Ahmed Adel. A driven medical student at Mansoura University passionate about internal medicine, clinical research, and making a meaningful impact in community healthcare.",
  primaryBtn: 'View My Work',
  secondaryBtn: 'Download Resume',
  badgeNum: '5+',
  badgeText: 'Years of Study',
  badgeSubtext: 'Clinical Experience',
  imageUrl:
    'https://images.unsplash.com/photo-1756699279298-c89cdef354ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFyYWIlMjBtYWxlJTIwZG9jdG9yJTIwc21pbGluZ3xlbnwxfHx8fDE3NzU5ODE5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

const defaultAbout = {
  introText:
    'I am a final-year medical student dedicated to bridging the gap between clinical excellence and empathetic patient care. My journey in medicine has been driven by a profound curiosity about human physiology and a commitment to serving communities.',
  journeyP1:
    "Currently pursuing my MBBCh at Mansoura University, one of Egypt's most prestigious medical institutions. Throughout my clinical rotations, I have developed a strong foundation in diagnostic reasoning, evidence-based medicine, and patient communication.",
  journeyP2:
    'Beyond academics, I am actively involved in medical outreach programs and public health campaigns, striving to improve health literacy in underserved areas. I believe that being a physician is not just about treating diseases, but healing people.',
};

const defaultContact = {
  email: 'ahmed.adel.med@example.com',
  phone: '+20 123 456 7890',
  linkedin: 'https://linkedin.com/in/ahmedadel',
  github: 'https://github.com/ahmedadel',
  twitter: 'https://twitter.com/ahmedadel',
  facebook: 'https://facebook.com/ahmedadel',
  whatsapp: 'https://wa.me/201234567890',
  address: 'Mansoura, Egypt',
};

const defaultEducation = [
  {
    degree: 'Bachelor of Medicine, Bachelor of Surgery (MBBCh)',
    institution: 'Mansoura University, Faculty of Medicine',
    date: '2019 - Present',
    description:
      'Comprehensive medical curriculum encompassing basic medical sciences and extensive clinical rotations across various specialties.',
    highlights: [
      'Consistent Excellence ranking throughout pre-clinical and clinical years',
      'Clinical rotations in Internal Medicine, General Surgery, Pediatrics, and OBGYN',
      "Active member of Mansoura Medical Students' Scientific Association",
    ],
    order: 0,
  },
  {
    degree: 'High School Diploma - Science Section',
    institution: 'Mansoura Distinguished Languages School',
    date: '2016 - 2019',
    description: 'Graduated with honors, focusing on Biology, Chemistry, and Physics.',
    highlights: [
      'Ranked top 1% nationally in General Secondary Education Certificate',
      'Leader of the School Science Club',
    ],
    order: 1,
  },
];

const defaultSkills = [
  {
    title: 'Clinical Skills',
    skills: ['History Taking', 'Physical Examination', 'Diagnostic Reasoning', 'Vital Signs Monitoring', 'Basic Life Support (BLS)', 'Suturing & Wound Care'],
    order: 0,
  },
  {
    title: 'Medical Knowledge',
    skills: ['Internal Medicine', 'Anatomy & Physiology', 'Pharmacology', 'Pathology', 'Preventive Medicine', 'Medical Ethics'],
    order: 1,
  },
  {
    title: 'Research & Technical',
    skills: ['Literature Review', 'Data Analysis (SPSS)', 'Medical Writing', 'Clinical Study Design', 'Healthcare Tech', 'Evidence-Based Practice'],
    order: 2,
  },
  {
    title: 'Soft Skills',
    skills: ['Patient Communication', 'Empathy & Compassion', 'Team Collaboration', 'Time Management', 'Critical Thinking', 'Crisis Management'],
    order: 3,
  },
];

const defaultProjects = [
  {
    title: 'Public Health Awareness Campaign',
    category: 'Community Outreach',
    image:
      'https://images.unsplash.com/photo-1775379995670-b4f24887ef9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHVibGljJTIwaGVhbHRoJTIwcG9zdGVyfGVufDF8fHx8MTc3NTk4MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'March 2023 - May 2023',
    role: 'Lead Coordinator',
    location: 'Mansoura City Centers',
    description:
      'Organized a university-wide diabetes screening and prevention campaign reaching over 500 local residents in Mansoura.',
    details: [
      'Spearheaded a team of 45 medical student volunteers to conduct free blood glucose screenings in high-traffic public areas.',
      'Collaborated with local health authorities to secure testing kits, sanitization supplies, and educational materials.',
      'Designed and distributed over 1,000 bilingual (Arabic/English) pamphlets on healthy lifestyle choices and early diabetes prevention.',
      'Successfully identified 32 individuals with undiagnosed pre-diabetes and referred them to university clinics for comprehensive follow-up care.',
    ],
    tags: ['Public Health', 'Leadership', 'Screening', 'Diabetes Awareness'],
    order: 0,
  },
  {
    title: 'Prevalence of Hypertension Study',
    category: 'Clinical Research',
    image:
      'https://images.unsplash.com/photo-1631556760585-2e846196d5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFiJTIwcmVzZWFyY2glMjBtaWNyb3Njb3BlfGVufDF8fHx8MTc3NTk4MTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'September 2022 - January 2023',
    role: 'Co-Author / Research Assistant',
    location: 'Mansoura University Hospital',
    description:
      'Co-authored a cross-sectional study analyzing the correlation between lifestyle factors and early-onset hypertension in young adults.',
    details: [
      'Collected and analyzed clinical data from over 400 outpatients using SPSS software for statistical significance.',
      'Conducted extensive literature reviews on the impact of modern dietary habits, sedentary lifestyles, and stress on cardiovascular health in young demographics.',
      'Assisted in drafting the final manuscript, incorporating feedback from senior cardiology professors.',
      "Presented preliminary findings at the Annual Medical Students Research Conference, receiving the 'Best Undergraduate Abstract' award.",
    ],
    tags: ['Data Analysis', 'Research', 'Cardiology', 'SPSS', 'Academic Writing'],
    order: 1,
  },
  {
    title: 'Medical Relief Volunteer',
    category: 'Volunteering',
    image:
      'https://images.unsplash.com/photo-1621353880594-70b5fd44ecb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBtZWRpY2FsJTIwb3V0cmVhY2glMjBjb21tdW5pdHl8ZW58MXx8fHwxNzc1OTgxOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: 'Summer 2021 & 2022',
    role: 'Clinical Volunteer',
    location: 'Rural Dakahlia Governorate',
    description:
      'Participated in weekly medical caravans providing basic health assessments and medications to underprivileged rural areas.',
    details: [
      'Assisted senior physicians in taking patient histories and performing basic physical examinations in low-resource settings.',
      'Managed the mobile pharmacy dispensing station, ensuring patients fully understood their medication dosages and schedules.',
      'Organized hygiene and sanitation workshops for children in local primary schools.',
      'Helped digitize paper-based patient records for the charity organization to track chronic disease prevalence in the area over time.',
    ],
    tags: ['Patient Care', 'Teamwork', 'Global Health', 'Rural Medicine'],
    order: 2,
  },
];

const defaultVolunteers = [
  {
    title: 'Medical Caravan Volunteer',
    organization: 'Egyptian Red Crescent',
    date: '2021 - Present',
    location: 'Various Rural Areas, Dakahlia',
    description:
      'Participated in bi-monthly medical caravans providing free basic health assessments, blood pressure monitoring, and health education to underserved rural communities.',
    color: 'bg-rose-50 border-rose-100 text-rose-500',
    order: 0,
  },
  {
    title: 'Blood Donation Drive Organizer',
    organization: "Mansoura Medical Students' Association",
    date: 'Oct 2022 & Mar 2023',
    location: 'Mansoura University Campus',
    description:
      'Co-organized two major university-wide blood donation drives. Registered donors, performed pre-donation vitals checks, and distributed post-donation care packages.',
    color: 'bg-red-50 border-red-100 text-red-500',
    order: 1,
  },
  {
    title: 'Child Life Support Volunteer',
    organization: "Mansoura University Children's Hospital",
    date: 'Summer 2021',
    location: 'Pediatric Oncology Ward',
    description:
      'Spent weekends organizing recreational activities, reading sessions, and art therapy for pediatric oncology patients to help reduce hospital-related anxiety.',
    color: 'bg-amber-50 border-amber-100 text-amber-500',
    order: 2,
  },
];

// ─── Seed Function ──────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB for seeding\n');

    // ── Admin ──
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Ahmed Adel',
        email: process.env.ADMIN_EMAIL || 'admin@ahmedadel.com',
        password: process.env.ADMIN_PASSWORD || 'changeme123',
      });
      console.log('  ✔  Admin account created');
    } else {
      console.log('  ⏭  Admin already exists — skipped');
    }

    // ── Hero ──
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      await Hero.create(defaultHero);
      console.log('  ✔  Hero seeded');
    } else {
      console.log('  ⏭  Hero already exists — skipped');
    }

    // ── About ──
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create(defaultAbout);
      console.log('  ✔  About seeded');
    } else {
      console.log('  ⏭  About already exists — skipped');
    }

    // ── Contact ──
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create(defaultContact);
      console.log('  ✔  Contact seeded');
    } else {
      console.log('  ⏭  Contact already exists — skipped');
    }

    // ── Education ──
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.insertMany(defaultEducation);
      console.log('  ✔  Education seeded (' + defaultEducation.length + ' items)');
    } else {
      console.log('  ⏭  Education already exists — skipped');
    }

    // ── Skills ──
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(defaultSkills);
      console.log('  ✔  Skills seeded (' + defaultSkills.length + ' categories)');
    } else {
      console.log('  ⏭  Skills already exist — skipped');
    }

    // ── Projects ──
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log('  ✔  Projects seeded (' + defaultProjects.length + ' items)');
    } else {
      console.log('  ⏭  Projects already exist — skipped');
    }

    // ── Volunteers ──
    const volCount = await Volunteer.countDocuments();
    if (volCount === 0) {
      await Volunteer.insertMany(defaultVolunteers);
      console.log('  ✔  Volunteers seeded (' + defaultVolunteers.length + ' items)');
    } else {
      console.log('  ⏭  Volunteers already exist — skipped');
    }

    // ── Site Settings ──
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create({});
      console.log('  ✔  Site Settings seeded (all visible)');
    } else {
      console.log('  ⏭  Site Settings already exist — skipped');
    }

    console.log('\n🌱  Seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌  Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
