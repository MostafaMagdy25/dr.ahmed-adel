const fs = require('fs');
const files = [
  '../src/app/pages/admin/AdminHero.tsx',
  '../src/app/pages/admin/AdminProjects.tsx',
  '../src/app/pages/admin/AdminAbout.tsx',
  '../src/app/pages/admin/AdminEducation.tsx',
  '../src/app/pages/admin/AdminSkills.tsx',
  '../src/app/pages/admin/AdminVolunteering.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
  content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
  content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-slate-50');
  content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-400');
  content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-slate-400/g, 'text-slate-400 dark:text-slate-500');
  content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
  content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-slate-700');
  content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800');
  content = content.replace(/bg-blue-50/g, 'bg-blue-50 dark:bg-blue-900\/30');
  content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
  // Avoid duplicate dark mode classes just in case
  content = content.replace(/dark:bg-slate-900 dark:bg-slate-900/g, 'dark:bg-slate-900');
  fs.writeFileSync(file, content);
}
console.log("Done");