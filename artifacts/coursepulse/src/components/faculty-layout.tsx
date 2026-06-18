import { Link, useLocation } from "wouter";
import { LogOut, LayoutDashboard, BookOpen, Target, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FacultyLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  if (typeof window !== 'undefined') {
    const isAuth = localStorage.getItem("facultyAuthenticated") === "true";
    if (!isAuth) {
      setLocation("/faculty-login");
      return null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("facultyAuthenticated");
    setLocation("/");
  };

  const navItems = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/faculty/course-context", label: "Course Context", icon: BookOpen },
    { href: "/faculty/impact-tracker", label: "Impact Tracker", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center font-bold">
                CP
              </div>
              <span className="font-serif font-semibold text-lg text-primary tracking-tight">CoursePulse AI</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/governance">
              <Button variant="ghost" size="icon" title="Responsible Use Policy">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
