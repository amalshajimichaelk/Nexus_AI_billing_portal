const fs = require('fs');
const path = require('path');

const directory = './app';

const replacements = {
  // Backgrounds
  'bg-white/40': 'bg-white/40 dark:bg-slate-900/40',
  'bg-white/50': 'bg-white/50 dark:bg-slate-800/50',
  'bg-white/60': 'bg-white/60 dark:bg-slate-800/60',
  'bg-white/80': 'bg-white/80 dark:bg-slate-800/80',
  'bg-white/90': 'bg-white/90 dark:bg-slate-900/90',
  'bg-white ': 'bg-white dark:bg-slate-800 ',
  'bg-white"': 'bg-white dark:bg-slate-800"',
  'bg-slate-50 ': 'bg-slate-50 dark:bg-slate-900/50 ',
  'bg-slate-50"': 'bg-slate-50 dark:bg-slate-900/50"',
  'bg-slate-100 ': 'bg-slate-100 dark:bg-slate-800 ',
  'bg-slate-100"': 'bg-slate-100 dark:bg-slate-800"',
  'bg-slate-200 ': 'bg-slate-200 dark:bg-slate-700 ',
  'bg-slate-200"': 'bg-slate-200 dark:bg-slate-700"',

  // Borders
  'border-white/80': 'border-white/80 dark:border-slate-700/50',
  'border-white/60': 'border-white/60 dark:border-slate-800',
  'border-white ': 'border-white dark:border-slate-700 ',
  'border-white"': 'border-white dark:border-slate-700"',
  'border-slate-200': 'border-slate-200 dark:border-slate-700',

  // Text
  'text-slate-800': 'text-slate-800 dark:text-slate-100',
  'text-slate-700': 'text-slate-700 dark:text-slate-200',
  'text-slate-600': 'text-slate-600 dark:text-slate-300',
  'text-slate-500': 'text-slate-500 dark:text-slate-400',
  'text-slate-400': 'text-slate-400 dark:text-slate-500',
  'text-slate-900': 'text-slate-900 dark:text-white',

  // Shadows
  'shadow-slate-100/50': 'shadow-slate-100/50 dark:shadow-none',
  'shadow-lg': 'shadow-lg dark:shadow-none',
  'shadow-xl': 'shadow-xl dark:shadow-none',
  'shadow-2xl': 'shadow-2xl dark:shadow-none',

  // Misc Hover
  'hover:bg-slate-100': 'hover:bg-slate-100 dark:hover:bg-slate-800',
  'hover:bg-slate-50': 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
  'hover:text-slate-600': 'hover:text-slate-600 dark:hover:text-slate-300',
  'hover:text-slate-800': 'hover:text-slate-800 dark:hover:text-slate-200',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('layout.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Perform safe replacements
      let newContent = content;
      for (const [search, replace] of Object.entries(replacements)) {
        // Prevent double replacement if script runs multiple times
        if (newContent.includes(replace)) continue;
        
        // Simple string replaceAll (using regex with global flag to avoid older node issues)
        const regex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g');
        newContent = newContent.replace(regex, replace);
      }
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

// We also need to specifically target the layout sidebar manually as we excluded it
let layoutPath = './app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace('bg-white/40 backdrop-blur-2xl border-r border-white/60', 'bg-white/40 dark:bg-slate-950/60 backdrop-blur-2xl border-r border-white/60 dark:border-slate-800');
layoutContent = layoutContent.replace('bg-white/80 shadow-sm border border-white/80 text-indigo-700 font-medium', 'bg-white/80 dark:bg-slate-800 shadow-sm border border-white/80 dark:border-slate-700 text-indigo-700 dark:text-indigo-400 font-medium');
layoutContent = layoutContent.replace('text-slate-500 hover:bg-white/40', 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/50');
layoutContent = layoutContent.replace('text-slate-400 uppercase tracking-widest', 'text-slate-400 dark:text-slate-500 uppercase tracking-widest');
fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Updated: app/layout.tsx');

processDirectory(directory);
console.log('Done.');
