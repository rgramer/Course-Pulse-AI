import { Link, useLocation } from "wouter";
import { LogOut, LayoutDashboard, BookOpen, Target, ShieldCheck, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoursePulseLogo } from "@/components/logo";

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
    { href: "/faculty/syllabus-upload", label: "Syllabus Upload", icon: Upload },
    { href: "/faculty/impact-tracker", label: "Impact Tracker", icon: Target },
    { href: "/faculty/report", label: "Report", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <CoursePulseLogo size="sm" />
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="gap-2 font-medium"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
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

      <div className="bg-muted/50 border-b py-2 px-4 sticky top-16 z-10 text-center">
        <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 opacity-70" />
          CoursePulse AI shows aggregated instructional patterns only. It does not grade, rank, predict failure, or evaluate individual students.
        </p>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
