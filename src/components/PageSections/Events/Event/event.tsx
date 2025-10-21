import { IEvent } from "@/lib/types";
import Image from "next/image";

interface Props {
  id: string;
}

export default async function EventSection({ id }: Props) {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
    cache: "no-store",
  });
  const event: IEvent = await res.json();

  return (
    <>
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden transition-all duration-300">
        <Image src={event.src} alt="" fill className="object-cover" priority />
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      <div className="container -mt-32 relative z-10 mx-auto px-4 lg:px-0">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          {event.title}
        </h1>
        <p>{event.description}</p>
      </div>
    </>
  );
}
