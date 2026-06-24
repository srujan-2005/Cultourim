import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad, User, BarChart, Bot ,SettingsIcon,Route, AlarmClockPlus, ChartAreaIcon, CalendarCogIcon, LucideDollarSign } from 'lucide-react';


const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
  {icon:BookOpen, label: 'Voyage-Vibes', path: '/voyage',},
  {icon:LucideDollarSign, label: 'Penny-Path', path: '/penny',},
  {icon:Route, label: 'Heritage-Hop', path: '/hop',},
  {icon:Bot,label:'Ask-Ava',path:'/ava',},
  { icon: SettingsIcon, label: 'Profile', path: '/profile', isLast: true }, 

];

function GradientIcon({ Icon }) {
    const svgString = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black" stroke-width="2" viewBox="0 0 24 24">${Icon?.({}).props.children.map(
        (child) => `<path d="${child.props.d}" />`
      ).join('')}</svg>`
    );
  
    const maskStyle = {
      WebkitMaskImage: `url("data:image/svg+xml,${svgString}")`,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskImage: `url("data:image/svg+xml,${svgString}")`,
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      maskSize: 'contain',
    };
  
    return (
      <div
        className="w-6 h-6 bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500"
        style={maskStyle}
      />
    );
  }
  

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed top-[50%] translate-y-[-50.5%] left-4 z-30 h-[65%] bg-black/20 rounded-lg border-gray-200 dark:border-gray-700 shadow-lg group transition-all duration-300">
      <div className="h-full w-14 group-hover:w-64 overflow-hidden transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center p-4 mb-2">
          </div>
          <nav className="mt-auto">
            {navItems
              .filter((item) => !item.isLast) 
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-600 dark:bg-white/20 dark:text-blue-500'
                      : ''
                  }`}
                >
<item.icon className="w-6 h-6 " />

<span className="ml-4 hidden group-hover:block font-pixel bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent text-sm font-extrabold">{item.label}</span>

                </Link>
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
