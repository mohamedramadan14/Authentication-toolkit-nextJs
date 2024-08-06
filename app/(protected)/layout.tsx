import { Navbar } from "./_components/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col gap-y-10 items-center justify-center bg-gradient-to-r from-slate-500 to-slate-800">
      <Navbar />
      {children}
    </div>
  );
};

export default AppLayout;
