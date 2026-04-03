import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Calendar, Info, Loader2 } from "lucide-react";

const Agenda = () => {
  const { data: calendarUrl, isLoading } = useQuery({
    queryKey: ["site_settings", "google_calendar_url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "google_calendar_url")
        .single();
      
      if (error) {
        console.warn("Could not fetch calendar URL, using default.", error);
        return "https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&src=znIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%230078d4";
      }
      return data.value;
    },
  });

  return (
    <div className="min-h-screen bg-background text-base">
      <Header />
      <main>
        <PageBanner 
          title="Agenda" 
          subtitle="Suivez les événements, réunions et actions de la CPTS Lyon 3."
        />

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="container max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 shadow-sm border border-sky-600/10">
                Calendrier Interactif
              </span>
              <h2 className="text-3xl md:text-6xl font-display font-bold text-navy mb-8 tracking-tighter">Événements à venir</h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-navy/5 shadow-3xl">
                <Loader2 className="w-16 h-16 text-sky-600 animate-spin mb-6" />
                <p className="text-navy/40 font-display font-bold text-2xl italic">Chargement du calendrier...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-[3rem] border border-navy/5 shadow-3xl shadow-navy/[0.04] overflow-hidden p-2 md:p-4"
              >
                <div className="aspect-[4/3] md:aspect-[16/9] w-full relative">
                  <iframe 
                    src={calendarUrl} 
                    style={{ border: 0 }} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no"
                    className="rounded-2xl shadow-inner bg-slate-50"
                    title="Agenda CPTS Lyon 3"
                  ></iframe>
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-16 bg-navy text-white p-10 md:p-14 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-navy/20"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-xl">
                    <Info className="w-10 h-10 text-sky-400" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">Comment synchroniser cet agenda ?</h3>
                    <p className="text-white/60 text-lg font-medium italic leading-relaxed">
                      L'agenda est consultable en ligne, mais vous pouvez également le synchroniser avec vos outils habituels (Google, Outlook, iCal). 
                      Les événements sont mis à jour en temps réel par l'équipe de coordination de la CPTS.
                    </p>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Agenda;
