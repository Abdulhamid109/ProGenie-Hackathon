import Joblisting from "@/components/Joblisting";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">      
      <div className="flex-1 flex flex-col">        
        <main className="flex-1 p-6">
          <h2 className="font-bold text-3xl mb-6">
            Hey Abdulhamid, welcome back!
          </h2>
          <Joblisting/>
        </main>
      </div>
    </div>
  );
}