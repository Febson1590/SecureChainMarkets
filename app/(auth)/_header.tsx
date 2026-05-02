import Link from "next/link";
import Image from "next/image";

export function AuthHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-center">
        <Link href="/" aria-label="VorateTrade — home" className="inline-flex items-center">
          <Image
            src="/assets/logos/voratetrade-logo.png"
            alt="VorateTrade"
            width={1774}
            height={887}
            priority
            className="h-[104px] sm:h-[120px] w-auto pointer-events-none select-none"
          />
        </Link>
      </div>
    </header>
  );
}
