import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const figmaPages = path.join(root, 'figma_make_latest/figma_prototype/src/app/pages');
const figmaCtx = path.join(root, 'figma_make_latest/figma_prototype/src/app/contexts/AppContext.tsx');
const figmaNav = path.join(root, 'figma_make_latest/figma_prototype/src/app/components/BottomNav.tsx');

const pageMap = {
  'Timeline.tsx': 'src/pages/timeline/TimelinePage.tsx',
  'MapPage.tsx': 'src/pages/map/MapPage.tsx',
  'AddRecord.tsx': 'src/pages/record/RecordNewPage.tsx',
  'RecordDetail.tsx': 'src/pages/record/RecordDetailPage.tsx',
  'Couple.tsx': 'src/pages/couple/CouplePage.tsx',
  'Settings.tsx': 'src/pages/settings/SettingsPage.tsx',
  'Auth.tsx': 'src/pages/auth/AuthPage.tsx',
};

function transform(content, isBottomNav = false) {
  let s = content;

  s = s.replace(
    /import \{ useLocation \} from 'wouter';/g,
    "import { useNavigate, useLocation } from 'react-router-dom';",
  );
  s = s.replace(
    /import \{ useLocation \} from "wouter";/g,
    'import { useNavigate, useLocation } from "react-router-dom";',
  );

  s = s.replace(/const \[, navigate\] = useLocation\(\);/g, 'const navigate = useNavigate();');
  s = s.replace(
    /const \[location, navigate\] = useLocation\(\);/g,
    'const location = useLocation();\n  const navigate = useNavigate();',
  );

  s = s.replace(/navigate\('\/timeline'\)/g, "navigate('/app/timeline')");
  s = s.replace(/navigate\("\/timeline"\)/g, 'navigate("/app/timeline")');
  s = s.replace(/navigate\('\/map'\)/g, "navigate('/app/map')");
  s = s.replace(/navigate\('\/add'\)/g, "navigate('/app/record/new')");
  s = s.replace(/navigate\('\/couple'\)/g, "navigate('/app/couple')");
  s = s.replace(/navigate\('\/settings'\)/g, "navigate('/app/settings')");
  s = s.replace(/navigate\('\/'\)/g, "navigate('/auth')");

  s = s.replace(/navigate\(`\/edit\/\$\{([^}]+)\}`\)/g, 'navigate(`/app/record/${$1}/edit`)');
  s = s.replace(/navigate\(`\/record\//g, 'navigate(`/app/record/');

  s = s.replace(/location\.startsWith\('\/timeline'\)/g, "location.pathname.startsWith('/app/timeline')");
  s = s.replace(/location\.startsWith\('\/map'\)/g, "location.pathname.startsWith('/app/map')");
  s = s.replace(/location\.startsWith\('\/add'\)/g, "location.pathname.startsWith('/app/record/new')");
  s = s.replace(/location\.startsWith\('\/couple'\)/g, "location.pathname.startsWith('/app/couple')");
  s = s.replace(/location\.startsWith\('\/settings'\)/g, "location.pathname.startsWith('/app/settings')");
  s = s.replace(/location\.startsWith\('\/record\/'\)/g, "location.pathname.startsWith('/app/record/')");
  s = s.replace(/location\.startsWith\('\/edit\/'\)/g, "location.pathname.startsWith('/app/record/') && location.pathname.endsWith('/edit')");

  if (isBottomNav) {
    s = s.replace(/path: '\/timeline'/g, "path: '/app/timeline'");
    s = s.replace(/path: '\/map'/g, "path: '/app/map'");
    s = s.replace(/path: '\/add'/g, "path: '/app/record/new'");
    s = s.replace(/path: '\/couple'/g, "path: '/app/couple'");
    s = s.replace(/path: '\/settings'/g, "path: '/app/settings'");
  }

  s = s.replace(
    /import LogoImage from '\.\.\/\.\.\/imports\/LovePin____png__-1\.png';/g,
    "import LogoImage from '../../assets/LovePin____png__-1.png';",
  );

  return s;
}

// AppContext
fs.mkdirSync(path.join(root, 'src/contexts'), { recursive: true });
fs.copyFileSync(figmaCtx, path.join(root, 'src/contexts/AppContext.tsx'));

// BottomNav
let nav = fs.readFileSync(figmaNav, 'utf8');
nav = nav.replace(/from '@\/contexts\/AppContext'/g, "from '@/contexts/AppContext'");
nav = transform(nav, true);
fs.mkdirSync(path.join(root, 'src/components'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/components/BottomNav.tsx'), nav);

// Pages
for (const [src, dest] of Object.entries(pageMap)) {
  const content = fs.readFileSync(path.join(figmaPages, src), 'utf8');
  let out = transform(content);

  if (src === 'RecordDetail.tsx') {
    out = out.replace(
      /import \{ useLocation \} from 'react-router-dom';/,
      "import { useNavigate, useParams } from 'react-router-dom';",
    );
    out = out.replace(
      /interface RecordDetailProps \{\s*id: string;\s*\}\s*\n\s*export default function RecordDetailPage\(\{ id \}: RecordDetailProps\)/,
      'export default function RecordDetailPage()',
    );
    out = out.replace(
      /const \[, navigate\] = useLocation\(\);/,
      'const navigate = useNavigate();\n  const { id } = useParams<{ id: string }>();',
    );
    out = out.replace(
      /navigate\(`\/app\/record\/\$\{record\.id\}\`\)/g,
      'navigate(`/app/record/${record.id}/edit`)',
    );
  }

  if (src === 'Auth.tsx') {
    out = out.replace(
      /if \(login\(email, pw\)\) navigate\('\/app\/timeline'\)/,
      "if (login(email, pw)) navigate('/app/timeline')",
    );
  }

  const destPath = path.join(root, dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, out);
  console.log('Wrote', dest);
}

console.log('Done');
