import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stethoscope, UserRound, Activity, Users as UsersIcon, HeartPulse, Building2, MapPin } from "lucide-react";
import lyon3GeoJSON from "@/assets/lyon3.json";

const TerritorySection = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up to support React.StrictMode double-invocations
    const container = mapRef.current;
    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
      container.innerHTML = "";
    }

    const map = L.map(container, {
      center: [45.753, 4.87],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
    });

    // Use a very light clean basemap to mimic the minimal reference style
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    L.geoJSON(lyon3GeoJSON as any, {
      style: {
        color: "#188bb3",
        weight: 3,
        opacity: 0.9,
        fillColor: "#188bb3",
        fillOpacity: 0.15,
      },
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="py-20 md:py-32">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="relative">
              <div 
                ref={mapRef}
                className="h-[400px] md:h-[500px] rounded-[2rem] w-full overflow-hidden shadow-lg border border-navy/5"
                style={{ zIndex: 1 }}
              />
              {/* Optional decorative blobs */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-sky-100 to-transparent opacity-50 rounded-[2rem] blur-2xl -z-10"></div>
            </div>
          </motion.div>

          {/* Text/Card Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="bg-[#F4F9FD] rounded-[2rem] p-8 md:p-12 lg:p-16 w-full relative overflow-hidden">
              {/* Small pill badge */}
              <div className="inline-block px-5 py-1.5 rounded-full border border-sky-600/30 text-sky-700 font-medium text-sm mb-6 bg-white shadow-sm">
                69. Rhône
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-12">
                CPTS Lyon 3
              </h2>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <h3 className="text-navy/90 font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    Le territoire :
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="inline-block px-6 py-2.5 rounded-full border border-sky-600/40 text-sky-800 font-medium text-sm bg-white shadow-sm hover:shadow-md transition-shadow">
                      Lyon 3e Arrondissement
                    </div>
                  </div>
                  <p className="text-navy/70 text-sm italic">
                    C'est l'arrondissement le plus peuplé de Lyon, avec plus de 101 800 habitants.
                  </p>
                </div>

                <div className="pt-6 border-t border-navy/5">
                  <h3 className="text-navy/90 font-bold text-lg mb-6 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-600" />
                    Offre de soins (Insee 2024) :
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Médecins généralistes", count: 85, icon: Stethoscope },
                      { label: "Dentistes", count: 83, icon: Activity },
                      { label: "Kinésithérapeutes", count: 163, icon: Activity },
                      { label: "Infirmiers", count: 113, icon: HeartPulse },
                      { label: "Psychologues", count: 210, icon: UserRound },
                      { label: "Pharmacies", count: 29, icon: Building2 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-2xl font-bold text-navy">{item.count}</span>
                        <span className="text-navy/60 text-xs font-semibold uppercase tracking-wider leading-tight">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-sky-600/5 rounded-2xl p-6 border border-sky-600/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <UsersIcon className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <div className="text-navy font-bold">1 médecin pour 1 198 habitants</div>
                        <div className="text-navy/60 text-xs uppercase font-bold tracking-wider">Densité médicale</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative faint background element */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TerritorySection;
