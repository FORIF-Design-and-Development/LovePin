import { Outlet, useLocation, Link } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();

  // 💡 하단 탭이 보여야 하는 경로에 '/app/record/new'를 추가했습니다!
  const mainTabPaths = [
    '/app/timeline',
    '/app/map',
    '/app/record/new', // <- 추가됨
    '/app/couple/status',
    '/app/couple/alarm',
    '/app/settings',
  ];

  const isMainTab = mainTabPaths.includes(location.pathname);

  // 탭 색상 결정 헬퍼 함수
  const getTabColor = (path: string, exact: boolean = true) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    return isActive ? "text-primary" : "text-[#C5CDD6]";
  };

  return (
    <div className="flex flex-col h-screen bg-background relative">
      
      {/* 💡 요청하신 공통 뒤로가기 헤더는 완전히 삭제했습니다! */}

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-y-auto relative scrollbar-hide pb-safe">
        <Outlet />
      </main>

      {/* 하단 탭 네비게이션 */}
      {isMainTab && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <nav className="h-[70px] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center text-[10px] shrink-0 pb-safe rounded-t-2xl relative">
            
            <Link to="/app/timeline" className={`flex flex-col items-center gap-1 w-16 transition-colors ${getTabColor('/app/timeline')}`}>
              <span className="text-2xl mb-0.5">🕐</span>
              <span className="font-semibold tracking-tight">타임라인</span>
            </Link>
            
            <Link to="/app/map" className={`flex flex-col items-center gap-1 w-16 transition-colors ${getTabColor('/app/map')}`}>
              <span className="text-2xl mb-0.5">🗺️</span>
              <span className="font-semibold tracking-tight">지도</span>
            </Link>
            
            {/* 가운데 플로팅 CTA 버튼 */}
            <div className="relative -top-6 w-16 flex justify-center">
              <Link 
                to="/app/record/new" 
                className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#f76e7e] to-[#ff9a9e] shadow-[0_8px_16px_rgba(247,110,126,0.3)] hover:scale-105 active:scale-95 transition-transform"
              >
                <span className="text-3xl text-white font-light mt-[-2px]">+</span>
              </Link>
            </div>
            
            <Link to="/app/couple/status" className={`flex flex-col items-center gap-1 w-16 transition-colors ${getTabColor('/app/couple', false)}`}>
              <span className="text-2xl mb-0.5">💑</span>
              <span className="font-semibold tracking-tight">연인</span>
            </Link>
            
            <Link to="/app/settings" className={`flex flex-col items-center gap-1 w-16 transition-colors ${getTabColor('/app/settings')}`}>
              <span className="text-2xl mb-0.5">⚙️</span>
              <span className="font-semibold tracking-tight">설정</span>
            </Link>

          </nav>
        </div>
      )}
      
    </div>
  );
}