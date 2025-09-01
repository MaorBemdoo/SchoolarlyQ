import AppLink from "@/components/AppLink";
import Button from "@/components/Button";

export const metadata = {
  title: "Page Not Found | SchoolarlyQ",
};

const NotFound = () => {
  return (
    <main className="containers h-screen text-center">
      <h1 className="text-[17rem] font-bold">404</h1>
      <p className="text-2xl mb-8">You seem to have missed your way</p>
      <AppLink href="/">
        <Button>Back Home</Button>
      </AppLink>
    </main>
  );
};
export default NotFound;
