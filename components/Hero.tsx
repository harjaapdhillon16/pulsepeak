export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <img src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png" className="h-30 w-30 object-cover"/>
     <p className="font-semibold text-4xl">PulsePeak</p>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="md:text-3xl text-xl lg:text-4xl break-words !leading-tight mx-auto text-center">
        The fastest way to <br className="hidden md:block"/> achieve your <span className="underline font-bold">fitness</span> goals
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
