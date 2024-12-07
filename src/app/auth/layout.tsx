import AppLink from "@/components/AppLink";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex *:place-content-center h-screen">
      <div className="relative grid basis-full bg-[url(/register.jpg)] bg-cover bg-center bg-no-repeat h-full md:basis-1/2 md:last:*:none">
        <AppLink
          href="/"
          className="absolute top-8 left-1/2 -translate-x-1/2 text-white flex items-center gap-1 font-bold text-2xl md:left-8 md:translate-x-0"
        >
          <Image src="/favicon.ico" alt="Logo image" width={50} height={50} />
          <h1>SchoolarlyQ</h1>
        </AppLink>
        {children}
      </div>
      <div className="none basis-1/2 h-full md:grid">{children}</div>
    </main>
  );
}
